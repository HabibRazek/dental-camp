import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Users,
  Shield,
  Heart,
  ArrowRight,
  Phone
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Link from "next/link";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "À propos | Dental Camp",
  description: "Découvrez l'histoire de Dental Camp, votre partenaire de confiance en équipements dentaires depuis 2008.",
};

export default function AboutPage() {
  const stats = [
    { number: "15+", label: "Années d'expérience", icon: <Award className="h-6 w-6" /> },
    { number: "500+", label: "Clients satisfaits", icon: <Users className="h-6 w-6" /> },
    { number: "1000+", label: "Produits disponibles", icon: <TbDental className="h-6 w-6" /> },
    { number: "98%", label: "Taux de satisfaction", icon: <Heart className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Qualité Garantie",
      description: "Tous nos produits sont certifiés CE et conformes aux normes internationales les plus strictes."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Service Client",
      description: "Une équipe dédiée pour vous accompagner dans tous vos projets et répondre à vos besoins."
    },
    {
      icon: <TbDental className="h-8 w-8" />,
      title: "Innovation",
      description: "Nous proposons les dernières technologies et innovations du secteur médical et dentaire."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Présence Régionale",
      description: "Une couverture complète en Tunisie et dans toute la région du Maghreb."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 mt-10 rounded-full mb-6">
              <TbDental className="h-4 w-4 mr-2" />
              À propos de nous
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Votre partenaire de confiance en
              <span className="block text-blue-600">
                équipements dentaires
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Depuis 2008, Dental Camp s&apos;engage à fournir aux professionnels de santé
              les équipements médicaux et dentaires de la plus haute qualité en Tunisie et dans la région.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Notre Mission
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Chez Dental Camp, notre mission est de démocratiser l&apos;accès aux équipements médicaux
            de haute qualité pour tous les professionnels de santé. Nous croyons que chaque
            praticien mérite d&apos;avoir accès aux meilleurs outils pour offrir des soins exceptionnels
            à ses patients.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nous nous engageons à maintenir les plus hauts standards de qualité, à offrir un
            service client exceptionnel et à rester à la pointe de l&apos;innovation technologique
            dans le domaine médical.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre action quotidienne et notre engagement envers nos clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full border border-gray-200 shadow-sm bg-white hover:shadow-lg transition-all duration-300 rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à découvrir nos produits ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explorez notre catalogue complet d&apos;équipements médicaux et dentaires de haute qualité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold"
              asChild
            >
              <Link href="/catalog">
                Voir le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-xl font-semibold border-2 border-white"
              asChild
            >
              <Link href="/#contact">
                Nous contacter
                <Phone className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
