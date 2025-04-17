
import { FuelPumpIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <FuelPumpIcon className="h-6 w-6 text-fuel-orange" />
              <span className="text-xl font-bold text-fuel-blue-dark">FastFuel</span>
            </Link>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Fuel delivered to your doorstep in Kandivali, Mumbai.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-center text-sm text-muted-foreground md:text-right">
              © 2025 FastFuel. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-fuel-blue">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-fuel-blue">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-fuel-blue">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
