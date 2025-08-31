
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  FileImage,
  Paperclip,
  MessageSquare
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['ticketStats'],
    queryFn: () => ticketsAPI.getStatistics(),
  });

  const { data: recentTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['recentTickets'],
    queryFn: () => ticketsAPI.getAll(1, 5),
  });

  // Debug: Log the tickets data to see what we're getting
  React.useEffect(() => {
    if (recentTickets?.data?.tickets) {
      console.log('Dashboard tickets data:', recentTickets.data.tickets);
      recentTickets.data.tickets.forEach((ticket: any, index: number) => {
        console.log(`Ticket ${index + 1}:`, {
          id: ticket.id,
          title: ticket.title,
          comments: ticket.comments,
          attachments: ticket.attachments,
          commentsCount: ticket.comments?.length || 0,
          attachmentsCount: ticket.attachments?.length || 0
        });
      });
    }
  }, [recentTickets]);

  const statistics = stats?.data || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  const statCards = [
    {
      title: 'Total Tickets',
      value: statistics.total,
      icon: Ticket,
      color: 'bg-blue-500',
    },
    {
      title: 'Open',
      value: statistics.open,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'In Progress',
      value: statistics.inProgress,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Resolved',
      value: statistics.resolved,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your support tickets today.
          </p>
        </div>
        <Link
          to="/tickets"
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {statsLoading ? (
                            <div className="animate-pulse h-6 bg-gray-200 rounded w-8"></div>
                          ) : (
                            stat.value
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tickets
            </h3>
            <Link
              to="/tickets"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all tickets
            </Link>
          </div>
          
          {ticketsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentTickets?.data?.tickets && recentTickets.data.tickets.length > 0 ? (
            <div className="overflow-hidden">
              <div className="space-y-3">
                {recentTickets.data.tickets.map((ticket: any) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      {/* Title Row */}
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 flex-1 mr-2"
                        >
                          {ticket.title}
                        </Link>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                      </p>
                      
                      {/* Status and Priority Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusColor(ticket.status)
                            }`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        
                        {/* Indicators */}
                        <div className="flex items-center space-x-1">
                          {/* Comments indicator */}
                          {ticket.comments && Array.isArray(ticket.comments) && ticket.comments.length > 0 && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                              title={`${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.comments.length}</span>
                            </Link>
                          )}
                          
                          {/* Photo attachments */}
                          {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.some((a: any) => a.mimeType && a.mimeType.startsWith('image/')) && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                              title={`${ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length} photo${ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                            >
                              <FileImage className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length}</span>
                            </Link>
                          )}
                          
                          {/* File attachments */}
                          {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.some((a: any) => a.mimeType && !a.mimeType.startsWith('image/')) && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                              title={`${ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length} file${ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex items-center justify-between space-x-4">
                      {/* Left section: Title and Description */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 block truncate"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {ticket.description}
                        </p>
                      </div>
                      
                      {/* Middle section: Status and Priority */}
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(ticket.status)
                          }`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)} min-w-0`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      {/* Indicators section */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Comments indicator */}
                        {ticket.comments && Array.isArray(ticket.comments) && ticket.comments.length > 0 && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            title={`${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.comments.length}</span>
                          </Link>
                        )}
                        
                        {/* Photo attachments */}
                        {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.some((a: any) => a.mimeType && a.mimeType.startsWith('image/')) && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                            title={`${ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length} photo${ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                          >
                            <FileImage className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.attachments.filter((a: any) => a.mimeType && a.mimeType.startsWith('image/')).length}</span>
                          </Link>
                        )}
                        
                        {/* File attachments */}
                        {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.some((a: any) => a.mimeType && !a.mimeType.startsWith('image/')) && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            title={`${ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length} file${ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                          >
                            <Paperclip className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.attachments.filter((a: any) => a.mimeType && !a.mimeType.startsWith('image/')).length}</span>
                          </Link>
                        )}
                      </div>
                      
                      {/* Right section: Date */}
                      <div className="text-sm text-gray-500 flex-shrink-0 min-w-0">
                        <div className="hidden md:block">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="md:hidden">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first support ticket.
              </p>
              <div className="mt-6">
                <Link
                  to="/tickets"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};