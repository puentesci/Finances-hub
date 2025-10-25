import { Button } from './ui/button';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-slate-900">Finances-Hub</h1>
        
        <Button 
          variant="outline" 
          className="border-2 border-slate-900 hover:bg-slate-100"
        >
          Login
        </Button>
      </div>
    </header>
  );
}
