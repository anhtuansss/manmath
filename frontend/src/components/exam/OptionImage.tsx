type OptionImageProps = {
  imageUrl?: string | null;
  alt: string;
  className?: string;
};

export function OptionImage({
  imageUrl,
  alt,
  className = '',
}: OptionImageProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <figure
      className={`overflow-hidden rounded-lg border border-border bg-surface p-3 ${className}`}
    >
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className="mx-auto max-h-40 w-full max-w-full object-contain"
      />
    </figure>
  );
}
