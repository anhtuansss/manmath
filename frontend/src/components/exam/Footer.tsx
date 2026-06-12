import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2 lg:col-span-2">
            <Link
              href="/"
              aria-label="Về trang chủ"
              className="group flex cursor-pointer items-center gap-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Logo className="h-8 w-8 transition-transform group-hover:scale-105" />
              <span className="text-xl font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary font-[family-name:var(--font-outfit)]">
                ManMath
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
              Nền tảng luyện thi Toán THPT Quốc gia miễn phí, thực tế và hiệu quả.
              Giúp học sinh rèn luyện kỹ năng giải đề dưới áp lực thời gian thực.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary font-[family-name:var(--font-outfit)]">Sản phẩm</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Danh sách đề thi
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-primary">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary font-[family-name:var(--font-outfit)]">Phát triển</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href="https://github.com/anhtuansss/manmath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Mã nguồn (GitHub)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-primary"
                >
                  Báo lỗi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary font-[family-name:var(--font-outfit)]">Liên hệ</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>
                <a href="mailto:manmaththpt@gmail.com" className="transition-colors hover:text-primary">
                  manmaththpt@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} ManMath. Nền tảng học tập mở.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <span className="text-xs text-text-secondary">
              Thiết kế dành cho học sinh Việt Nam.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
