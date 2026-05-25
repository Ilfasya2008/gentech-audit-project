import { ArrowRight, Blocks, FileCheck, TrendingUp } from 'lucide-react';
// @ts-ignore
import logo from '../assets/e30af63daf2be06e1fa092ee01c14ce054e902ae.png';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Logo */}
        <img src={logo} alt="GenTech Audit" className="w-36 h-36 mb-6" />
        
        {/* Title */}
        <h1 className="text-primary text-center mb-3">
          GenTech Audit
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Platform pembelajaran audit digital berbasis blockchain untuk Generasi Z
        </p>

        {/* Feature Cards */}
        <div className="w-full space-y-3 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Blocks className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-primary">Blockchain Learning</h3>
                <p className="text-muted-foreground">Modul interaktif</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-primary">Audit Simulation</h3>
                <p className="text-muted-foreground">Praktik langsung</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-primary">Track Progress</h3>
                <p className="text-muted-foreground">Dashboard lengkap</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm pb-safe">
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl hover:bg-blue-800 transition shadow-lg"
        >
          Mulai Perjalanan
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}