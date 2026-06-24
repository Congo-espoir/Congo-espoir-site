import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      {/* Party stripe */}
      <div className="party-stripe h-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="sm" variant="white" />
              <div>
                <div className="font-bold text-lg">CONGO ESPOIR</div>
                <div className="text-gold-400 text-xs tracking-widest uppercase">Justice · Patriotisme · Social</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Parti de la sociale-démocratie fondé par l'Arrêté Ministériel N° 122/2005 du 22 mars 2005.
              Initiateur : Maître JOSE MPANDA KABANGU.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/valeurs', label: 'Nos Valeurs' },
                { to: '/actualites', label: 'Actualités' },
                { to: '/adhesion', label: 'Adhérer au parti' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Structures */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Structures</h4>
            <ul className="space-y-2">
              {[
                'Ligue des Femmes',
                'Ligue des Jeunes',
                'Club de Penseurs',
                'Bureau Politique',
                'Directoire National',
                'École du Parti',
              ].map(item => (
                <li key={item}>
                  <span className="text-white/60 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin size={14} className="mt-0.5 text-gold-400 shrink-0" />
                <span>Kinshasa, République Démocratique du Congo</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Phone size={14} className="text-gold-400 shrink-0" />
                <span>+243 000 000 000</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Mail size={14} className="text-gold-400 shrink-0" />
                <span>contact@congoespoir.cd</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                to="/adhesion"
                className="inline-block w-full text-center bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                Rejoindre le parti
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Parti Politique CONGO ESPOIR. Tous droits réservés.
          </p>
          <p className="text-white/40 text-xs">"Justice, Patriotisme, Social"</p>
        </div>
      </div>
    </footer>
  )
}
