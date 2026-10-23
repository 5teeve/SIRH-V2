import { GoogleGenAI } from '@google/genai';

// Domain fallback engine for SIRH in case Gemini API key is missing or calls fail
function getDomainFallback(message: string): string {
  const q = message.toLowerCase();
  let reply = "Je suis votre Assistant RH Intelligent. ";

  if (q.includes('validation') || q.includes('besoin') || q.includes('demande') || q.includes('approbation')) {
    reply += `Le circuit d'approbation d'une demande de recrutement s'effectue en 4 étapes séquentielles :
1. **Création & Soumission** par le Manager de service.
2. **Validation RH** : contrôle de l'adéquation au poste, compétences et effectif autorisé.
3. **Validation Finance** : vérification de l'enveloppe budgétaire et de la masse salariale.
4. **Approbation Direction Générale** : arbitrage stratégique final.
Dès validation finale par la Direction, la demande passe au statut "OUVERTE" et l'offre d'emploi peut être directement publiée sur le portail carrières.`;
  } else if (q.includes('contrat') || q.includes('essai') || q.includes('cdd') || q.includes('cdi') || q.includes('renouvellement')) {
    reply += `Concernant la réglementation des contrats de travail :
- **Période d'essai** : 90 jours maximum pour un CDI (renouvelable une fois sous condition d'accord), 30 jours pour un CDD.
- **Renouvellement CDD** : Limité légalement à 2 renouvellements consécutifs maximum avant requalification obligatoire en CDI.
- **Matricule Salarié** : Attribué de manière séquentielle et unique (ex: EMP-2026-0001) dès la signature du contrat.
- **Pièces obligatoires** : Copie CIN, certificat de résidence, casier judiciaire, certificat médical, diplômes certifiés, RIB.`;
  } else if (q.includes('onboarding') || q.includes('integration') || q.includes('tache') || q.includes('accueil')) {
    reply += `Le parcours d'onboarding est automatiquement déclenché dès l'acceptation de l'offre d'embauche :
- **RH** : Signature du contrat et remise du livret d'accueil.
- **IT** : Création des comptes (emails, Slack, GitHub) et configuration du poste informatique.
- **Logistique** : Remise du matériel et badge d'accès sécurisé au campus.
- **Paie** : Affiliation sociale (CNaPS / OSTIE) et enregistrement des coordonnées bancaires.
- **Manager** : Entretien d'accueil le premier jour et fixation des objectifs de période d'essai.`;
  } else if (q.includes('entretien') || q.includes('grille') || q.includes('evaluation') || q.includes('note')) {
    reply += `Concernant les entretiens et les évaluations :
- **Planification sans collision** : Le système empêche qu'un membre du jury ou une salle soit réservé sur deux entretiens simultanés.
- **Grille d'évaluation multicritères** : Les compétences techniques, l'architecture et les soft skills sont notés avec pondération.
- **Verrouillage inviolable** : Une fois signée et enregistrée, une fiche d'évaluation est scellée pour garantir l'intégrité du processus de sélection.`;
  } else {
    reply += `Je suis à votre disposition pour vous guider sur les 4 blocs du SIRH :
- **Bloc 1 : Expression du besoin** (postes vacants, effectif autorisé, circuit Manager ➔ RH ➔ Finance ➔ Direction)
- **Bloc 2 : Recrutement** (publication des offres, présélection pondérée, entretiens sans collision)
- **Bloc 3 : Embauche** (propositions salariales, contrat CDI/CDD, pièces justificatives)
- **Bloc 4 : Onboarding** (checklists collaboratives RH/IT/Logistique/Paie, matricule unique et alertes fin d'essai)

Que souhaitez-vous savoir ?`;
  }

  return reply;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Le champ message est requis.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `Tu es l'Assistant RH Intelligent du SIRH Entreprise, un système d'information des ressources humaines de référence.
Tu accompagnes les managers, responsables RH, directeurs financiers et candidats.
Ton expertise couvre :
1. Expression des besoins en personnel : fiches de postes, vacance, circuits d'approbation (Manager -> RH -> Finance -> Direction).
2. Recrutement & Sélection : offres d'emploi, présélection sur critères pondérés, planification des entretiens sans collision de salle, grilles d'évaluation verrouillées.
3. Sélection & Embauche : négociation de rémunération, période d'essai (90j CDI, 30j CDD), clauses légales (confidentialité, préavis, respect du Code du travail), transaction d'embauche indivisible.
4. Contrats & Onboarding : cycle de vie du contrat, attribution séquentielle du matricule collaborateur (ex: EMP-2026-0043), checklist d'intégration répartie (RH, IT, Logistique, Paie, Manager), alertes d'échéances et renouvellements CDD (max 2 renouvellements).

Réponds de manière professionnelle, claire, bienveillante, concise et structurée en français. Utilise des listes à puces si nécessaire.`;

      const formattedContents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          formattedContents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }

      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || getDomainFallback(message);
      return res.status(200).json({ reply, source: 'gemini' });
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, falling back to domain engine:', geminiError?.message || geminiError);
      const fallback = getDomainFallback(message);
      return res.status(200).json({
        reply: fallback,
        source: 'fallback',
        notice: 'Réponse générée par le moteur expert SIRH.',
      });
    }
  }

  // No API key configured: provide instant expert SIRH response without error
  const fallback = getDomainFallback(message);
  return res.status(200).json({
    reply: fallback,
    source: 'domain_rules',
    notice: 'Pour activer Gemini en direct sur Vercel, ajoutez la variable GEMINI_API_KEY dans vos paramètres Vercel.',
  });
}
