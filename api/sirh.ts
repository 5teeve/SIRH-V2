/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { neon } from '@neondatabase/serverless';

// Helper to get Neon SQL client using standard environment variables
export function getDbClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL;

  if (!connectionString || connectionString.trim() === '') {
    return null;
  }

  return neon(connectionString);
}

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getDbClient();

  // If no database connection string is configured
  if (!sql) {
    return res.status(200).json({
      ok: false,
      connected: false,
      message:
        "Aucune chaîne de connexion PostgreSQL détectée. Définissez DATABASE_URL ou POSTGRES_URL dans les variables d'environnement Vercel ou .env.",
      source: 'local_fallback',
    });
  }

  // GET: Healthcheck or Load all SIRH entities from Neon PostgreSQL
  if (req.method === 'GET') {
    const action = req.query?.action || 'load';

    if (action === 'health' || action === 'ping') {
      try {
        const pingResult = await sql`SELECT NOW() as server_time, current_database() as database_name, version() as pg_version`;
        const tablesResult = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `;

        return res.status(200).json({
          ok: true,
          connected: true,
          serverTime: pingResult[0]?.server_time,
          databaseName: pingResult[0]?.database_name,
          version: pingResult[0]?.pg_version,
          tablesCount: tablesResult.length,
          tables: tablesResult.map((t: any) => t.table_name),
        });
      } catch (err: any) {
        console.error('Neon ping error:', err);
        return res.status(500).json({
          ok: false,
          connected: false,
          error: err.message,
        });
      }
    }

    // Default: Load data from Neon PostgreSQL
    try {
      // Execute queries in parallel to hydrate the SIRH store
      const [
        users,
        departements,
        services,
        postes,
        demandes,
        offres,
        candidats,
        candidatures,
        entretiens,
        evaluations,
        propositions,
        contrats,
        employes,
        onboardings,
        taches,
        journal,
        notifications,
        parametres,
        referentiels,
      ] = await Promise.all([
        sql`SELECT id, matricule, nom, prenom, email, role, departement_id, service_id, actif, created_at FROM utilisateurs WHERE is_deleted = false ORDER BY nom, prenom`,
        sql`SELECT id, code, nom, description, responsable_id FROM departements ORDER BY code`,
        sql`SELECT id, departement_id, code, nom, description, responsable_id FROM services ORDER BY code`,
        sql`SELECT id, code, intitule, departement_id, service_id, description, competences_requises, fourchette_salaire_min, fourchette_salaire_max, effectif_autorise, effectif_pourvu, statut FROM postes ORDER BY code`,
        sql`SELECT id, numero, type, demandeur_id, poste_id, departement_id, service_id, nombre_postes, motif, justification, type_contrat_souhaite, date_souhaitee, urgence, budget_estime, ancien_titulaire_ref, statut, etape_validation_actuelle, date_validation_finale, created_at FROM demandes_recrutement ORDER BY created_at DESC`,
        sql`SELECT id, reference, demande_id, poste_id, titre, departement_id, missions, profil_recherche, competences_requises, type_contrat, lieu, salaire_affiche, salaire_min, salaire_max, nombre_postes, postes_pourvus, date_publication, date_cloture, statut, cree_par, created_at FROM offres_emploi ORDER BY date_publication DESC`,
        sql`SELECT id, cin, nom, prenom, date_naissance, email, telephone, adresse, cv_url, titre_actuel, annees_experience, created_at FROM candidats ORDER BY created_at DESC`,
        sql`SELECT id, numero, offre_id, candidat_id, statut, score_preselection, rang_final, commentaires_rh, date_reception, created_at FROM candidatures ORDER BY created_at DESC`,
        sql`SELECT id, candidature_id, type_entretien, date_heure, duree_minutes, salle, modalite, lien_visio, interviewer_nom, interviewer_role, statut, created_at FROM entretiens ORDER BY date_heure DESC`,
        sql`SELECT id, entretien_id, candidature_id, evaluateur_nom, note_technique, note_soft_skills, note_globale, commentaire, recommandation, verrouille, date_evaluation, created_at FROM evaluations ORDER BY date_evaluation DESC`,
        sql`SELECT id, numero, candidature_id, poste_id, version, remuneration_mensuelle, type_contrat, date_debut_prevue, duree_mois, periode_essai_jours, horaires_travail, lieu_travail, avantages, date_limite_reponse, statut, date_reponse, motif_refus_ou_negociation, emise_par, created_at FROM propositions_embauche ORDER BY created_at DESC`,
        sql`SELECT id, numero, employe_id, poste_id, contrat_precedent_id, type_contrat, date_debut, date_fin, periode_essai_fin, remuneration_base, duree_hebdomadaire_heures, lieu_travail, statut, date_signature, document_signe_url, signe_par_employe, signe_par_employeur, date_validation, valide_par, motif_annulation, numero_avenant, created_at FROM contrats WHERE is_deleted = false ORDER BY created_at DESC`,
        sql`SELECT id, matricule, candidat_origine_id, candidature_origine_id, nom, prenom, cin, date_naissance, lieu_naissance, nationalite, situation_matrimoniale, nombre_enfants, email_professionnel, email_personnel, telephone, adresse_domicile, numero_cnaps, numero_ostie, rib_bancaire, statut, date_entree, date_sortie, created_at FROM employes ORDER BY created_at DESC`,
        sql`SELECT id, employe_id, contrat_id, modele_id, date_debut, date_fin_prevue, date_cloture_reelle, statut, taux_avancement, commentaires, created_at FROM onboardings ORDER BY created_at DESC`,
        sql`SELECT id, onboarding_id, titre, description, responsable, assigne_a, date_echeance, obligatoire, statut, date_realisation, commentaire_realisation, created_at FROM taches_onboarding ORDER BY date_echeance ASC`,
        sql`SELECT id, utilisateur_id, nom_utilisateur, role_utilisateur, entite, entite_id, action, valeur_avant, valeur_apres, motif_ou_commentaire, adresse_ip, created_at FROM journal_mouvements ORDER BY created_at DESC LIMIT 100`,
        sql`SELECT id, destinataire_id, titre, message, type, lien_cible, lu, date_lecture, created_at FROM notifications ORDER BY created_at DESC LIMIT 50`,
        sql`SELECT cle, valeur, type_donnee, description, modifiable_par_admin FROM parametres`,
        sql`SELECT id, categorie, code, libelle, description, ordre, actif FROM referentiels WHERE actif = true ORDER BY categorie, ordre`,
      ]);

      // Normalize array types and field mappings for the frontend
      const normalizedPostes = postes.map((p: any) => ({
        ...p,
        competences_requises: Array.isArray(p.competences_requises)
          ? p.competences_requises
          : typeof p.competences_requises === 'string'
            ? p.competences_requises.replace(/^\{|\}$/g, '').split(',')
            : [],
        fourchette_salaire_min: Number(p.fourchette_salaire_min) || 0,
        fourchette_salaire_max: Number(p.fourchette_salaire_max) || 0,
        effectif_autorise: Number(p.effectif_autorise) || 0,
        effectif_pourvu: Number(p.effectif_pourvu) || 0,
      }));

      const normalizedOffres = offres.map((o: any) => ({
        ...o,
        competences_requises: Array.isArray(o.competences_requises)
          ? o.competences_requises
          : typeof o.competences_requises === 'string'
            ? o.competences_requises.replace(/^\{|\}$/g, '').split(',')
            : [],
        salaire_min: Number(o.salaire_min) || 0,
        salaire_max: Number(o.salaire_max) || 0,
        nombre_postes: Number(o.nombre_postes) || 1,
        postes_pourvus: Number(o.postes_pourvus) || 0,
      }));

      const normalizedPropositions = propositions.map((pr: any) => ({
        ...pr,
        remuneration_mensuelle: Number(pr.remuneration_mensuelle) || 0,
        version: Number(pr.version) || 1,
        periode_essai_jours: Number(pr.periode_essai_jours) || 90,
        avantages: Array.isArray(pr.avantages) ? pr.avantages : [],
      }));

      const normalizedContrats = contrats.map((c: any) => ({
        ...c,
        remuneration_base: Number(c.remuneration_base) || 0,
        duree_hebdomadaire_heures: Number(c.duree_hebdomadaire_heures) || 40,
        numero_avenant: Number(c.numero_avenant) || 0,
      }));

      // Combine onboardings with their taches
      const normalizedOnboardings = onboardings.map((ob: any) => {
        const relatedTaches = taches.filter((t: any) => t.onboarding_id === ob.id);
        const employe = employes.find((e: any) => e.id === ob.employe_id);
        return {
          id: ob.id,
          employe_id: ob.employe_id,
          employe_nom: employe ? `${employe.prenom} ${employe.nom}` : 'Collaborateur',
          employe_matricule: employe?.matricule || 'En cours',
          contrat_id: ob.contrat_id,
          date_debut: ob.date_debut,
          date_fin_prevue: ob.date_fin_prevue,
          statut: ob.statut,
          taux_avancement: Number(ob.taux_avancement) || 0,
          taches: relatedTaches.map((t: any) => ({
            id: t.id,
            onboarding_id: t.onboarding_id,
            titre: t.titre,
            description: t.description || '',
            service_responsable: t.responsable,
            statut: t.statut,
            obligatoire: t.obligatoire,
            date_echeance: t.date_echeance,
            date_realisation: t.date_realisation,
            commentaire: t.commentaire_realisation,
          })),
        };
      });

      return res.status(200).json({
        ok: true,
        connected: true,
        source: 'neon_postgres',
        data: {
          users,
          departements,
          services,
          postes: normalizedPostes,
          demandes,
          offres: normalizedOffres,
          candidats,
          candidatures,
          entretiens,
          evaluations,
          propositions: normalizedPropositions,
          contrats: normalizedContrats,
          employes,
          onboardings: normalizedOnboardings,
          journal,
          notifications,
          parametres,
          referentiels,
        },
      });
    } catch (dbError: any) {
      console.error('Error fetching data from Neon PostgreSQL:', dbError);
      return res.status(500).json({
        ok: false,
        connected: false,
        error: dbError.message,
        hint: "Vérifiez que les scripts 01 à 09 ont été exécutés dans la base Neon.",
      });
    }
  }

  // POST: Execute mutation / sync with Neon PostgreSQL
  if (req.method === 'POST') {
    const { action, payload } = req.body || {};

    try {
      if (action === 'create_demande' && payload) {
        const d = payload;
        const result = await sql`
          INSERT INTO demandes_recrutement (
            id, numero, type, demandeur_id, poste_id, departement_id, service_id,
            nombre_postes, motif, justification, type_contrat_souhaite, date_souhaitee,
            urgence, budget_estime, ancien_titulaire_ref, statut, etape_validation_actuelle
          ) VALUES (
            ${d.id}, ${d.numero}, ${d.type}, ${d.demandeur_id}, ${d.poste_id}, ${d.departement_id}, ${d.service_id},
            ${d.nombre_postes}, ${d.motif}, ${d.justification}, ${d.type_contrat_souhaite}, ${d.date_souhaitee},
            ${d.urgence}, ${d.budget_estime}, ${d.ancien_titulaire_ref || null}, ${d.statut}, ${d.etape_validation_actuelle || 'RH'}
          )
          ON CONFLICT (id) DO UPDATE SET
            statut = EXCLUDED.statut,
            etape_validation_actuelle = EXCLUDED.etape_validation_actuelle,
            updated_at = NOW()
          RETURNING id, numero, statut;
        `;
        return res.status(200).json({ ok: true, result });
      }

      if (action === 'update_demande_statut' && payload) {
        const { id, statut, etape_validation_actuelle, date_validation_finale } = payload;
        const result = await sql`
          UPDATE demandes_recrutement
          SET statut = ${statut},
              etape_validation_actuelle = ${etape_validation_actuelle || null},
              date_validation_finale = ${date_validation_finale || null},
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, numero, statut;
        `;
        return res.status(200).json({ ok: true, result });
      }

      if (action === 'create_offre' && payload) {
        const o = payload;
        const result = await sql`
          INSERT INTO offres_emploi (
            id, reference, demande_id, poste_id, titre, departement_id,
            missions, profil_recherche, competences_requises, type_contrat,
            lieu, salaire_affiche, salaire_min, salaire_max, nombre_postes,
            postes_pourvus, date_publication, date_cloture, statut, cree_par
          ) VALUES (
            ${o.id}, ${o.reference}, ${o.demande_id}, ${o.poste_id}, ${o.titre}, ${o.departement_id},
            ${o.missions}, ${o.profil_recherche}, ${o.competences_requises || []}, ${o.type_contrat},
            ${o.lieu}, ${o.salaire_affiche ?? true}, ${o.salaire_min}, ${o.salaire_max}, ${o.nombre_postes},
            ${o.postes_pourvus || 0}, ${o.date_publication}, ${o.date_cloture}, ${o.statut}, ${o.cree_par}
          )
          ON CONFLICT (id) DO UPDATE SET
            statut = EXCLUDED.statut,
            postes_pourvus = EXCLUDED.postes_pourvus,
            updated_at = NOW()
          RETURNING id, reference, statut;
        `;
        return res.status(200).json({ ok: true, result });
      }

      if (action === 'create_candidature' && payload) {
        const { candidat, candidature } = payload;
        if (candidat) {
          await sql`
            INSERT INTO candidats (
              id, cin, nom, prenom, date_naissance, email, telephone, adresse, cv_url, titre_actuel, annees_experience
            ) VALUES (
              ${candidat.id}, ${candidat.cin}, ${candidat.nom}, ${candidat.prenom}, ${candidat.date_naissance},
              ${candidat.email}, ${candidat.telephone}, ${candidat.adresse}, ${candidat.cv_url || null},
              ${candidat.titre_actuel || null}, ${candidat.annees_experience || 0}
            )
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              telephone = EXCLUDED.telephone,
              updated_at = NOW();
          `;
        }
        if (candidature) {
          const result = await sql`
            INSERT INTO candidatures (
              id, numero, offre_id, candidat_id, statut, score_preselection, rang_final, commentaires_rh
            ) VALUES (
              ${candidature.id}, ${candidature.numero}, ${candidature.offre_id}, ${candidature.candidat_id},
              ${candidature.statut}, ${candidature.score_preselection || 0}, ${candidature.rang_final || null},
              ${candidature.commentaires_rh || null}
            )
            ON CONFLICT (id) DO UPDATE SET
              statut = EXCLUDED.statut,
              score_preselection = EXCLUDED.score_preselection,
              rang_final = EXCLUDED.rang_final,
              updated_at = NOW()
            RETURNING id, numero, statut;
          `;
          return res.status(200).json({ ok: true, result });
        }
        return res.status(200).json({ ok: true });
      }

      if (action === 'create_proposition' && payload) {
        const p = payload;
        const result = await sql`
          INSERT INTO propositions_embauche (
            id, numero, candidature_id, poste_id, version, remuneration_mensuelle,
            type_contrat, date_debut_prevue, duree_mois, periode_essai_jours,
            horaires_travail, lieu_travail, avantages, date_limite_reponse, statut, emise_par
          ) VALUES (
            ${p.id}, ${p.numero}, ${p.candidature_id}, ${p.poste_id}, ${p.version || 1},
            ${p.remuneration_mensuelle}, ${p.type_contrat}, ${p.date_debut_prevue},
            ${p.duree_mois || null}, ${p.periode_essai_jours || 90}, ${p.horaires_travail},
            ${p.lieu_travail}, ${p.avantages || []}, ${p.date_limite_reponse}, ${p.statut}, ${p.emise_par || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            statut = EXCLUDED.statut,
            remuneration_mensuelle = EXCLUDED.remuneration_mensuelle,
            updated_at = NOW()
          RETURNING id, numero, statut;
        `;
        return res.status(200).json({ ok: true, result });
      }

      if (action === 'log_mouvement' && payload) {
        const m = payload;
        await sql`
          INSERT INTO journal_mouvements (
            utilisateur_id, nom_utilisateur, role_utilisateur, entite, entite_id,
            action, valeur_avant, valeur_apres, motif_ou_commentaire
          ) VALUES (
            ${m.utilisateur_id || null}, ${m.nom_utilisateur}, ${m.role_utilisateur || null},
            ${m.entite}, ${m.entite_id}, ${m.action},
            ${m.valeur_avant ? JSON.stringify(m.valeur_avant) : null},
            ${m.valeur_apres ? JSON.stringify(m.valeur_apres) : null},
            ${m.motif_ou_commentaire || null}
          );
        `;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({
        ok: false,
        error: `Action '${action}' non reconnue.`,
      });
    } catch (mutationError: any) {
      console.error('Neon SQL mutation error:', mutationError);
      return res.status(500).json({
        ok: false,
        error: mutationError.message,
      });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée.' });
}
