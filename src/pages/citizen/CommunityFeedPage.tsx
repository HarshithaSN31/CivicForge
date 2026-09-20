import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Heart,
  MessageSquare,
  Award,
  MapPin,
  CheckCircle2,
  Send,
  Users
} from 'lucide-react';

export const CommunityFeedPage: React.FC = () => {
  const { posts, comments, credits, addPostComment, creditContributor, togglePostLike } = useData();
  const { currentUser } = useAuth();

  const currentUserId = currentUser?.id || '';
  const currentUserName = currentUser?.name || '';

  const [creditPostId, setCreditPostId] = useState<string | null>(null);
  const [creditRecipientId, setCreditRecipientId] = useState<string>('');
  const [creditRecipientName, setCreditRecipientName] = useState<string>('');
  const [creditActivityId, setCreditActivityId] = useState<string>('');
  const [creditMessage, setCreditMessage] = useState<string>('');

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const openCreditModal = (postId: string, volunteerId: string, volunteerName: string, activityId: string) => {
    setCreditPostId(postId);
    setCreditRecipientId(volunteerId);
    setCreditRecipientName(volunteerName);
    setCreditActivityId(activityId);
    setCreditMessage(`Great job ${volunteerName}! Credited for your outstanding civic contribution.`);
  };

  const handleSendCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditRecipientId || !creditMessage.trim()) return;

    creditContributor(
      creditActivityId,
      currentUserId,
      currentUserName,
      creditRecipientId,
      creditRecipientName,
      creditMessage
    );

    setCreditPostId(null);
    alert(`🎉 Contributor Credit sent to ${creditRecipientName}! Leaderboard ranking updated.`);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    if (!currentUser) {
      alert('Please sign in to comment.');
      return;
    }

    addPostComment(postId, currentUserId, currentUserName, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-civic-navy text-white p-6 rounded-xl shadow-civic space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Users className="w-4 h-4 text-amber-400" />
          Civic Community Action Feed (India)
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Verified Civic Impact Feed</h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          See real-time before & after proof of work performed by verified citizen volunteers across India.
        </p>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 font-medium">
            No verified civic activities yet.
          </Card>
        ) : (
          posts.map((post) => {
            const postComments = comments.filter((c) => c.postId === post.id);
            const postCredits = credits.filter((c) => c.activityId === post.activityId);

            return (
              <Card key={post.id} className="overflow-hidden shadow-xs border border-slate-200">
                <CardHeader className="bg-slate-50/90 border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.volunteerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={post.volunteerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-civic-accent"
                    />
                    <div>
                      <div className="font-bold text-sm text-civic-navy flex items-center gap-1.5">
                        {post.volunteerName}
                        <Badge variant="green" size="sm" className="text-[10px] px-1.5 py-0">
                          <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> Verified Contributor
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-civic-accent" />
                        {post.location.city}, {post.location.state} (India) • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs"
                    icon={<Award className="w-3.5 h-3.5 text-amber-500" />}
                    onClick={() => openCreditModal(post.id, post.volunteerId, post.volunteerName, post.activityId)}
                  >
                    Credit Contributor
                  </Button>
                </CardHeader>

                <CardBody className="p-5 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-base text-civic-navy mb-1">{post.title}</h3>
                    <p className="text-slate-700 text-xs leading-relaxed">{post.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {post.beforePhotoUrl && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          1. Before Volunteer Action
                        </span>
                        <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
                          <img src={post.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        2. After Verified Action
                      </span>
                      <div className="rounded-lg overflow-hidden border-2 border-emerald-500 bg-slate-900 aspect-video">
                        <img src={post.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {postCredits.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <strong>{postCredits.length} Contributor Credits Received!</strong> Last credit from {postCredits[0].giverUserName}: "{postCredits[0].message}"
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-slate-600">
                    <button
                      onClick={() => togglePostLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                        post.userLiked ? 'bg-red-50 text-red-600' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.reactionCount} Applause</span>
                    </button>

                    <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                      <MessageSquare className="w-4 h-4" />
                      {postComments.length} Comments
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-lg">
                    <div className="space-y-2">
                      {postComments.map((comm) => (
                        <div key={comm.id} className="bg-white p-2.5 rounded-md border border-slate-200 text-[11px]">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-civic-navy">{comm.userName}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700">{comm.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write a supportive comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAddComment(post.id)}
                        icon={<Send className="w-3.5 h-3.5" />}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {creditPostId && (
        <Modal
          isOpen={true}
          onClose={() => setCreditPostId(null)}
          title={`Give Contributor Credit to ${creditRecipientName}`}
        >
          <form onSubmit={handleSendCredit} className="space-y-4 text-xs">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-900 leading-relaxed">
              Giving credit boosts {creditRecipientName}'s score on the <strong>Top Civic Contributors Leaderboard</strong>.
            </div>

            <div>
              <label className="block font-bold text-civic-navy mb-1">
                Kudos / Appreciation Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={creditMessage}
                onChange={(e) => setCreditMessage(e.target.value)}
                placeholder="Write a personalized note of thanks..."
                className="w-full p-2.5 border border-civic-border rounded-md text-xs focus:ring-2 focus:ring-civic-accent focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreditPostId(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                icon={<Award className="w-4 h-4" />}
              >
                Send Contributor Credit
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
