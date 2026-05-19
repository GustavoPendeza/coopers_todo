export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-black px-4 py-12"
      style={{
        clipPath: 'polygon(0 56px, 100% 0, 100% 100%, 0 100%)',
        paddingTop: 'calc(56px + 2rem)'
      }}
    >
      <div className="relative z-10 text-center">
        <p className="text-base font-medium text-white lg:text-lg xl:text-xl 2xl:text-2xl">
          Need help?
        </p>
        <a
          href="mailto:coopers@coopers.pro"
          className="hover:text-brand mt-4 block text-lg font-semibold text-white transition-colors lg:text-xl"
        >
          coopers@coopers.pro
        </a>
        <p className="mt-3 text-xs text-white lg:text-sm">
          © {new Date().getFullYear()} Coopers. All rights reserved.
        </p>
      </div>

      {/* Decorative green bar at very bottom */}
      <div
        className="bg-brand absolute bottom-0 left-1/2 h-2 w-full -translate-x-1/2 md:w-1/3"
        style={{
          clipPath: 'polygon(0 12px, 100% 0, 100% 100%, 0 100%)',
          paddingTop: 'calc(12px + 2rem)'
        }}
      />
    </footer>
  );
}
