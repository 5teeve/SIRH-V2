/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI on server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chatbot API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Le message est requis.' });
    }

    // System instruction defining the SIRH HR Assistant persona
    const systemInstruction = `Tu es l'Assistant RH Intelligent du SIRH Entreprise, un système d'information des ressources humaines de référence.
Tu accompagnes les managers, responsables RH, directeurs financiers et candidats.
Ton expertise couvre :
1. Expression des besoins en personnel : fiches de postes, vacance, circuits d'approbation (Manager -> RH -> Finance -> Direction).
2. Recrutement & Sélection : offres d'emploi, présélection sur critères pondérés, planification des entretiens sans collision de salle, grilles d'évaluation verrouillées.
3. Sélection & Embauche : négociation de rémunération, période d'essai (90j CDI, 30j CDD), clauses légales (confidentialité, préavis, respect du Code du travail), transaction d'embauche indivisible.
4. Contrats & Onboarding : cycle de vie du contrat, attribution séquentielle du matricule collaborateur (ex: EMP-2026-0043), checklist d'intégration répartie (RH, IT, Logistique, Paie, Manager), alertes d'échéances et renouvellements CDD (max 2 renouvellements).

Réponds de manière professionnelle, claire, bienveillante, concise et structurée en français. Utilise des listes à puces si nécessaire.`;

    const hasValidKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

    if (hasValidKey) {
      try {
        // Build conversation contents for multi-turn chat
        const formattedContents: any[] = [];

        if (Array.isArray(history)) {
          for (const item of history.slice(-8)) {
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

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout de réponse Gemini (8s)')), 8000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const reply = response.text || 'Désolé, je n’ai pas pu formuler de réponse.';
        return res.json({ reply });
      } catch (geminiError: any) {
        console.warn('Gemini API call timed out or failed, using high-fidelity SIRH domain engine:', geminiError.message);
      }
    }

    // High-fidelity domain-aware responses for SIRH
    let fallbackReply = `Je suis votre Assistant RH. `;
    const q = message.toLowerCase();

      if (q.includes('validation') || q.includes('besoin') || q.includes('demande')) {
        fallbackReply += `Le circuit d'approbation d'une demande de recrutement s'effectue en 4 étapes séquentielles :
1. **Création & Soumission** par le Manager de service.
2. **Validation RH** : contrôle de l'adéquation au poste et des compétences.
3. **Validation Finance** : vérification de l'enveloppe budgétaire.
4. **Approbation Direction Générale** : arbitrage stratégique.
Dès validation finale, la demande passe à "Ouverte" et l'offre peut être publiée.`;
      } else if (q.includes('contrat') || q.includes('essai') || q.includes('cdd') || q.includes('cdi')) {
        fallbackReply += `Concernant la réglementation des contrats :
- **Période d'essai** : 90 jours maximum pour un CDI (renouvelable une fois), 30 jours pour un CDD.
- **Renouvellement CDD** : Limité légalement à 2 renouvellements consécutifs avant requalification en CDI.
- **Matricule Salarié** : Attribué de manière séquentielle et unique dès la signature du premier contrat de travail.`;
      } else if (q.includes('onboarding') || q.includes('integration') || q.includes('tache')) {
        fallbackReply += `Le parcours d'onboarding est automatiquement déclenché dès l'acceptation de l'offre d'embauche :
- **RH** : Signature du contrat et livret d'accueil.
- **IT** : Création des accès emails, Slack, GitHub et postes.
- **Logistique** : Remise de l'ordinateur portable et du badge de campus.
- **Paie** : Affiliation sociale CNaPS / OSTIE et enregistrement RIB.
- **Manager** : Entretien d'accueil et présentation des objectifs.`;
      } else {
        fallbackReply += `Je suis à votre disposition pour vous guider sur les 4 blocs du SIRH :
- **Expression du besoin** (postes, effectifs autorisés, circuit de validation)
- **Recrutement** (offres, entretiens, grilles d'évaluation scellées)
- **Embauche** (propositions d'embauche, contrats de travail et pièces)
- **Onboarding** (checklists d'intégration par service, matricules et alertes d'échéances)

Quelle question souhaitez-vous approfondir ?`;
      }

      return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de la réponse du chatbot RH.',
      details: error.message,
    });
  }
});

// Mount Vite middleware in development mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SIRH Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
