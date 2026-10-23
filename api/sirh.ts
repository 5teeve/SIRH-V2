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
      let services = await sql`SELECT * FROM services ORDER BY code`;
      if (services.length === 0) {
        try {
          await sql`
            INSERT INTO services (id, departement_id, code, nom, description, responsable_id) VALUES
            ('d0010000-0000-0000-0000-000000000001', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SRV-DEV', 'Développement Web, Mobile & Cloud', 'Ingénierie logicielle et plateformes digitales', '22222222-2222-2222-2222-222222222222'),
            ('d0010000-0000-0000-0000-000000000002', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SRV-DEVOPS', 'Infrastructures & Cloud Ops', 'Hébergement, CI/CD et sécurité des réseaux', '22222222-2222-2222-2222-222222222222'),
            ('d0010000-0000-0000-0000-000000000003', 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SRV-REC', 'Attraction des Talents & Recrutement', 'Sourcing et sélection des candidats', '33333333-3333-3333-3333-333333333333')
            ON CONFLICT (id) DO NOTHING;
          `;
          services = await sql`SELECT * FROM services ORDER BY code`;
        } catch (e) {
          console.warn('Error seeding services:', e);
        }
      }

      let postes = await sql`SELECT * FROM postes ORDER BY code`;
      if (postes.length === 0 && services.length > 0) {
        try {
          await sql`
            INSERT INTO postes (id, code, intitule, departement_id, service_id, description, competences_requises, fourchette_salaire_min, fourchette_salaire_max, effectif_autorise, effectif_pourvu) VALUES
            ('e0010000-0000-0000-0000-000000000001', 'PST-DEV-FS', 'Ingénieur Full-Stack Senior (TypeScript / PostgreSQL)', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000001', 'Conception et développement de solutions web robustes et scalables.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker', 'Architecture REST'], 3500000.00, 5500000.00, 4, 2),
            ('e0010000-0000-0000-0000-000000000002', 'PST-DEVOPS', 'Ingénieur DevOps & SRE', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000002', 'Administration des pipelines CI/CD, cluster Kubernetes et monitoring.', ARRAY['Kubernetes', 'Terraform', 'Linux', 'AWS/GCP', 'PostgreSQL Admin'], 4000000.00, 6000000.00, 2, 1),
            ('e0010000-0000-0000-0000-000000000003', 'PST-RH-REC', 'Chargé(e) de Recrutement & Marque Employeur', 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd0010000-0000-0000-0000-000000000003', 'Pilotage complet du cycle de recrutement et onboarding des nouveaux talents.', ARRAY['Sourcing', 'Entretiens', 'Droit du travail malgache', 'SIRH'], 2000000.00, 3200000.00, 3, 2)
            ON CONFLICT (id) DO NOTHING;
          `;
          postes = await sql`SELECT * FROM postes ORDER BY code`;
        } catch (e) {
          console.warn('Error seeding postes:', e);
        }
      }

      const [
        users,
        departements,
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
        sql`SELECT * FROM utilisateurs WHERE is_deleted = false ORDER BY nom, prenom`,
        sql`SELECT * FROM departements ORDER BY code`,
        sql`SELECT * FROM demandes_recrutement ORDER BY created_at DESC`,
        sql`SELECT * FROM offres_emploi ORDER BY date_publication DESC`,
        sql`SELECT * FROM candidats ORDER BY created_at DESC`,
        sql`SELECT * FROM candidatures ORDER BY created_at DESC`,
        sql`SELECT * FROM entretiens ORDER BY created_at DESC`,
        sql`SELECT * FROM evaluations ORDER BY created_at DESC`,
        sql`SELECT * FROM propositions_embauche ORDER BY created_at DESC`,
        sql`SELECT * FROM contrats WHERE is_deleted = false ORDER BY created_at DESC`,
        sql`SELECT * FROM employes ORDER BY created_at DESC`,
        sql`SELECT * FROM onboardings ORDER BY created_at DESC`,
        sql`SELECT * FROM taches_onboarding ORDER BY date_echeance ASC`,
        sql`SELECT * FROM journal_mouvements ORDER BY created_at DESC LIMIT 100`,
        sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`,
        sql`SELECT * FROM parametres`,
        sql`SELECT * FROM referentiels WHERE actif = true ORDER BY categorie, ordre`,
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
            commentaire: t.commentaire_execution || t.commentaire_realisation || '',
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
      if (action === 'create_poste' && payload) {
        const p = payload;
        const isUuid = (val: string) =>
          typeof val === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

        const posteId = isUuid(p.id) ? p.id : crypto.randomUUID();

        const result = await sql`
          INSERT INTO postes (
            id, code, intitule, departement_id, service_id, description,
            competences_requises, fourchette_salaire_min, fourchette_salaire_max,
            effectif_autorise, effectif_pourvu, statut
          ) VALUES (
            ${posteId}, ${p.code}, ${p.intitule}, ${p.departement_id}, ${p.service_id},
            ${p.description}, ${p.competences_requises || []}, ${p.fourchette_salaire_min},
            ${p.fourchette_salaire_max}, ${p.effectif_autorise || 1}, ${p.effectif_pourvu || 0},
            ${p.statut || 'ACTIF'}
          )
          ON CONFLICT (code) DO UPDATE SET
            intitule = EXCLUDED.intitule,
            description = EXCLUDED.description,
            competences_requises = EXCLUDED.competences_requises,
            fourchette_salaire_min = EXCLUDED.fourchette_salaire_min,
            fourchette_salaire_max = EXCLUDED.fourchette_salaire_max,
            effectif_autorise = EXCLUDED.effectif_autorise,
            statut = EXCLUDED.statut,
            updated_at = NOW()
          RETURNING id, code, intitule;
        `;
        return res.status(200).json({ ok: true, result });
      }

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
        const { id, statut, etape_validation_actuelle } = payload;
        const result = await sql`
          UPDATE demandes_recrutement
          SET statut = ${statut},
              etape_validation_actuelle = ${etape_validation_actuelle || null},
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
