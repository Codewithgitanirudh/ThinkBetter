export default function MarketingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen">
        {/* Marketing-specific header/nav */}
        {children}
        {/* Marketing footer */}
      </div>
    );
  }