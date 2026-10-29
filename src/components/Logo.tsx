import logo from "../assets/logo-data";

export default function Logo({ className = "h-10" }: { className?: string }) {
  return <img src={logo} alt="EDULINKIA" width={480} height={147} className={`block w-auto ${className}`} />;
}
