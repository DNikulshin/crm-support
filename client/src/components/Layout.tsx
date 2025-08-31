import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  User, 
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    ...(user?.role === 'ADMIN' ? [{ name: 'Users', href: '/users', icon: Users }] : []),
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:text-primary hover:bg-accent'
        } ${mobile ? 'text-base' : ''}`}
        onClick={mobile ? () => setSidebarOpen(false) : undefined}
      >
        <Icon className={`h-6 w-6 shrink-0 ${mobile ? 'mr-1' : ''}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="sticky top-0 z-30 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm border-b sm:px-6 lg:hidden">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <div className="flex-1 text-sm font-semibold leading-6">
            CRM Support
          </div>
          <div className="flex items-center gap-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-xl font-bold">CRM Support</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavItem item={item} mobile />
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Your profile</span>
                    <span>{user?.firstName} {user?.lastName}</span>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="icon"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold">CRM Support</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavItem item={item} />
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 border-t">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Your profile</span>
                  <span>{user?.firstName} {user?.lastName}</span>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};