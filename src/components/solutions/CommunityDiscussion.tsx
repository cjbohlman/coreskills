import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag, 
  User,
  Clock,
  Award,
  TrendingUp,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isHighlighted?: boolean;
  tags: string[];
}

interface CommunityDiscussionProps {
  challengeId: string;
  challengeTitle: string;
}

export const CommunityDiscussion: React.FC<CommunityDiscussionProps> = ({
  challengeId,
  challengeTitle
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('popular');
  const [filterBy, setFilterBy] = useState<'all' | 'solutions' | 'questions' | 'insights'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from the database
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Chen',
        content: 'Great challenge! I initially went with a microservices approach but realized the complexity might be overkill for the given requirements. The modular monolith solution makes much more sense for this scale.',
        createdAt: '2024-01-15T10:30:00Z',
        likes: 24,
        dislikes: 2,
        replies: [
          {
            id: '1-1',
            userId: 'user2',
            userName: 'Mike Johnson',
            content: 'Totally agree! I made the same mistake initially. The key insight is understanding when NOT to use microservices.',
            createdAt: '2024-01-15T11:15:00Z',
            likes: 8,
            dislikes: 0,
            replies: [],
            tags: ['insight']
          }
        ],
        isHighlighted: true,
        tags: ['solution', 'insight']
      },
      {
        id: '2',
        userId: 'user3',
        userName: 'Alex Rodriguez',
        content: 'Has anyone considered the serverless approach? I think it could work well for this use case, especially with the variable traffic patterns mentioned in the requirements.',
        createdAt: '2024-01-15T09:45:00Z',
        likes: 15,
        dislikes: 3,
        replies: [
          {
            id: '2-1',
            userId: 'user4',
            userName: 'Emma Wilson',
            content: 'Interesting point! What about cold start latency though? For a real-time system, that could be problematic.',
            createdAt: '2024-01-15T10:00:00Z',
            likes: 6,
            dislikes: 1,
            replies: [],
            tags: ['question']
          },
          {
            id: '2-2',
            userId: 'user3',
            userName: 'Alex Rodriguez',
            content: 'Good point about cold starts. You could mitigate that with provisioned concurrency or by keeping functions warm. The cost trade-off might still be worth it.',
            createdAt: '2024-01-15T10:30:00Z',
            likes: 4,
            dislikes: 0,
            replies: [],
            tags: ['solution']
          }
        ],
        tags: ['solution', 'serverless']
      },
      {
        id: '3',
        userId: 'user5',
        userName: 'David Kim',
        content: 'I\'m struggling with the database design part. Should I go with SQL or NoSQL for this type of application? The data relationships seem complex but the scale requirements suggest NoSQL might be better.',
        createdAt: '2024-01-15T08:20:00Z',
        likes: 12,
        dislikes: 0,
        replies: [
          {
            id: '3-1',
            userId: 'user6',
            userName: 'Lisa Zhang',
            content: 'Why not both? You could use SQL for transactional data and NoSQL for analytics/caching. Polyglot persistence is a valid approach.',
            createdAt: '2024-01-15T09:00:00Z',
            likes: 9,
            dislikes: 1,
            replies: [],
            tags: ['solution']
          }
        ],
        tags: ['question', 'database']
      }
    ];
    setComments(mockComments);
  }, [challengeId]);

  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email || 'Anonymous',
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      tags: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim() || !user) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email || 'Anonymous',
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      tags: []
    };

    setComments(comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!user) return;

    if (isReply && parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'solution': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'question': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'insight': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'serverless': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'database': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredComments = comments.filter(comment => {
    if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterBy === 'all') return true;
    return comment.tags.includes(filterBy);
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default:
        return 0;
    }
  });

  const CommentComponent: React.FC<{ comment: Comment; isReply?: boolean; parentId?: string }> = ({ 
    comment, 
    isReply = false, 
    parentId 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''} ${
        comment.isHighlighted ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-300">
          <User size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.userName}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isHighlighted && (
              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full">
                <Award size={12} />
                Highlighted
              </span>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {comment.content}
          </p>
          
          {comment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {comment.tags.map(tag => (
                <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
            >
              <ThumbsUp size={14} />
              {comment.likes}
            </button>
            
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
              <ThumbsDown size={14} />
              {comment.dislikes}
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                <Reply size={14} />
                Reply
              </button>
            )}
            
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
              <Flag size={14} />
              Report
            </button>
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-300">
                  <User size={12} />
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community Discussion
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Share insights, ask questions, and learn from other developers' approaches to "{challengeTitle}"
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MessageSquare size={16} />
            {comments.length} discussion{comments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Posts</option>
              <option value="solutions">Solutions</option>
              <option value="questions">Questions</option>
              <option value="insights">Insights</option>
            </select>
          </div>
        </div>
      </div>

      {/* New Comment Form */}
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Join the Discussion
          </h3>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-300">
              <User size={16} />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, insights, or questions about this challenge..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={4}
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Be respectful and constructive in your feedback
                </p>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  leftIcon={<Plus size={16} />}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {sortedComments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <CommentComponent comment={comment} />
            </div>
          ))}
        </AnimatePresence>
        
        {sortedComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No discussions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Be the first to share your thoughts on this challenge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};