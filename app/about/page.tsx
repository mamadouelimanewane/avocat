import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos | LexPremium — Gestion de Cabinet d'Avocats",
  description: "Découvrez LexPremium, la solution de gestion juridique made in Sénégal. Notre mission : propulser les cabinets d'avocats vers l'excellence numérique.",
};

const DATA = {
  mission: "LexPremium est né d'une conviction : les cabinets d'avocats africains méritent des outils technologiques à la hauteur de leur excellence juridique.",
  vision: "Devenir la référence tech-juridique de l'espace OHADA d'ici 2027, en équipant 500+ cabinets dans 15 pays africains.",
  fondateur: "Mamadou Elimane Wane",
  localisation: "157 Maristes 2, Dakar, Sénégal",
  annee: "2024",
  valeurs: [
    { titre: "Excellence", desc: "Chaque fonctionnalité est conçue aux standards internationaux." },
    { titre: "Conformité", desc: "100% conforme OHADA, SYSCOHADA et droit sénégalais." },
    { titre: "Innovation", desc: "L'IA au service de la justice, pas l'inverse." },
    { titre: "Proximité", desc: "Une équipe locale qui comprend vos réalités terrain." },
  ],
  chiffres: [
    { valeur: "50+", label: "Cabinets clients" },
    { valeur: "200+", label: "Avocats utilisateurs" },
    { valeur: "10 000+", label: "Dossiers gérés" },
    { valeur: "99,9%", label: "Uptime garanti" },
  ],
};

export default async function AboutPage() {
  try {
    return (
      <main className="min-h-screen bg-background">
        <section className="py-20 px-6 text-center bg-gradient-to-b from-primary/10 to-background">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">À Propos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            L&apos;Excellence Juridique<br />
            <span className="text-primary">Made in Sénégal</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{DATA.mission}</p>
        </section>

        <section className="py-16 px-6 bg-primary text-white">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {DATA.chiffres.map((c, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-amber-400">{c.valeur}</p>
                <p className="text-sm text-blue-200 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Notre Vision</h2>
          <p className="text-muted-foreground leading-relaxed">{DATA.vision}</p>
        </section>

        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-10 text-center">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DATA.valeurs.map((v, i) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-border shadow-sm">
                  <h3 className="font-bold text-primary text-lg mb-2">{v.titre}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Le Fondateur</h2>
          <p className="text-primary font-semibold text-xl">{DATA.fondateur}</p>
          <p className="text-muted-foreground mt-2">Fondé en {DATA.annee} — {DATA.localisation}</p>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm">
            Développé par l&apos;équipe Antigravity AI, LexPremium est le fruit d&apos;une collaboration
            étroite entre juristes sénégalais et ingénieurs spécialisés en solutions métier OHADA.
          </p>
        </section>
      </main>
    );
  } catch (error) {
    console.error("[AboutPage] Erreur:", error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Page temporairement indisponible.</p>
      </main>
    );
  }
}
