'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StarRating } from './StarRating';
import { getProductReviews, canUserReview, submitReview } from '@/app/producto/[slug]/review-actions';

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userName: string | null;
};

export function ProductReviews({ productId }: { productId: number }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const data = await getProductReviews(productId);
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
    setTotalReviews(data.totalReviews);

    if (session?.user) {
      const check = await canUserReview(productId);
      setCanReview(check.canReview);
      setReason(check.reason ?? '');
      if (check.canReview && 'orderId' in check) {
        setOrderId(check.orderId ?? null);
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId) return;
    setSubmitting(true);
    const result = await submitReview(productId, orderId, { rating, comment });
    setSubmitting(false);
    if (result.success) {
      setShowForm(false);
      setComment('');
      setRating(5);
      refresh();
    }
  }

  return (
    <div className="mt-20 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display italic text-3xl text-brand-text-dark mb-1">Reseñas</h2>
          {totalReviews > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly size="sm" />
              <span className="text-sm text-brand-text-muted">
                {avgRating.toFixed(1)} · {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-brand-text-muted">Aún no hay reseñas</p>
          )}
        </div>

        {session?.user && canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-brand-gold-dark hover:underline cursor-pointer"
          >
            Escribir reseña
          </button>
        )}
      </div>

      {session?.user && !canReview && reason === 'not_purchased' && (
        <p className="text-xs text-brand-text-muted mb-6">
          Solo los clientes que compraron este producto pueden dejar una reseña.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-brand-white border border-brand-beige-line p-6 mb-8 flex flex-col gap-4">
          <div>
            <p className="text-xs text-brand-text-muted mb-2">Tu calificación</p>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
          <div>
            <p className="text-xs text-brand-text-muted mb-2">Tu comentario (opcional)</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-black text-brand-cream px-6 py-2.5 text-sm font-medium hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Publicar Reseña'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-brand-text-muted hover:text-brand-text-dark cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-brand-beige-line pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-brand-text-dark font-medium">{review.userName ?? 'Cliente'}</p>
              <p className="text-xs text-brand-text-muted">
                {new Date(review.createdAt).toLocaleDateString('es-CL')}
              </p>
            </div>
            <StarRating value={review.rating} readonly size="sm" />
            {review.comment && <p className="text-sm text-brand-text-muted mt-2">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}