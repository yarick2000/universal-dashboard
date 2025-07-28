import { render, screen } from '@testing-library/react';

import Home from './page';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    priority,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-priority={priority}
        {...props}
      />
    );
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  describe('Layout and Structure', () => {
    it('should render the main container with correct CSS classes', () => {
      const container = screen.getByRole('main').parentElement;
      expect(container).toHaveClass(
        'font-sans',
        'grid',
        'grid-rows-[20px_1fr_20px]',
        'items-center',
        'justify-items-center',
        'min-h-screen',
      );
    });

    it('should render main content area', () => {
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(
        'flex',
        'flex-col',
        'gap-[32px]',
        'row-start-2',
        'items-center',
        'sm:items-start',
      );
    });

    it('should render footer', () => {
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'row-start-3',
        'flex',
        'gap-[24px]',
        'flex-wrap',
        'items-center',
        'justify-center',
      );
    });
  });

  describe('Next.js Logo', () => {
    it('should display the Next.js logo with correct attributes', () => {
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/next.svg');
      expect(logo).toHaveAttribute('width', '180');
      expect(logo).toHaveAttribute('height', '38');
      expect(logo).toHaveAttribute('data-priority', 'true');
      expect(logo).toHaveClass('dark:invert');
    });
  });

  describe('Getting Started Instructions', () => {
    it('should display the getting started list', () => {
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass(
        'font-mono',
        'list-inside',
        'list-decimal',
        'text-sm/6',
        'text-center',
        'sm:text-left',
      );
    });

    it('should display the first instruction about editing the file', () => {
      const firstInstruction = screen.getByText(/Get started by editing/);
      expect(firstInstruction).toBeInTheDocument();

      const codeElement = screen.getByText('src/app/page.tsx');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveClass(
        'bg-black/[.05]',
        'dark:bg-white/[.06]',
        'font-mono',
        'font-semibold',
        'px-1',
        'py-0.5',
        'rounded',
      );
    });

    it('should display the second instruction about saving changes', () => {
      const secondInstruction = screen.getByText('Save and see your changes instantly.');
      expect(secondInstruction).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render the Deploy now button with correct attributes', () => {
      const deployButton = screen.getByRole('link', { name: /deploy now/i });
      expect(deployButton).toBeInTheDocument();
      expect(deployButton).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
      expect(deployButton).toHaveAttribute('target', '_blank');
      expect(deployButton).toHaveAttribute('rel', 'noopener noreferrer');

      // Check if Vercel logo is present
      const vercelLogo = screen.getByAltText('Vercel logomark');
      expect(vercelLogo).toBeInTheDocument();
      expect(vercelLogo).toHaveAttribute('src', '/vercel.svg');
      expect(vercelLogo).toHaveAttribute('width', '20');
      expect(vercelLogo).toHaveAttribute('height', '20');
    });

    it('should render the Read our docs button with correct attributes', () => {
      const docsButton = screen.getByRole('link', { name: /read our docs/i });
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toHaveAttribute('href', 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
      expect(docsButton).toHaveAttribute('target', '_blank');
      expect(docsButton).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have proper button styling classes', () => {
      const deployButton = screen.getByRole('link', { name: /deploy now/i });
      expect(deployButton).toHaveClass(
        'rounded-full',
        'border',
        'border-solid',
        'border-transparent',
        'bg-foreground',
        'text-background',
      );

      const docsButton = screen.getByRole('link', { name: /read our docs/i });
      expect(docsButton).toHaveClass(
        'rounded-full',
        'border',
        'border-solid',
        'border-black/[.08]',
        'dark:border-white/[.145]',
      );
    });
  });

  describe('Footer Links', () => {
    it('should render Learn link with correct attributes', () => {
      const learnLink = screen.getByRole('link', { name: /learn/i });
      expect(learnLink).toBeInTheDocument();
      expect(learnLink).toHaveAttribute('href', 'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
      expect(learnLink).toHaveAttribute('target', '_blank');
      expect(learnLink).toHaveAttribute('rel', 'noopener noreferrer');

      const fileIcon = screen.getByAltText('File icon');
      expect(fileIcon).toBeInTheDocument();
      expect(fileIcon).toHaveAttribute('src', '/file.svg');
    });

    it('should render Examples link with correct attributes', () => {
      const examplesLink = screen.getByRole('link', { name: /examples/i });
      expect(examplesLink).toBeInTheDocument();
      expect(examplesLink).toHaveAttribute('href', 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
      expect(examplesLink).toHaveAttribute('target', '_blank');
      expect(examplesLink).toHaveAttribute('rel', 'noopener noreferrer');

      const windowIcon = screen.getByAltText('Window icon');
      expect(windowIcon).toBeInTheDocument();
      expect(windowIcon).toHaveAttribute('src', '/window.svg');
    });

    it('should render Go to nextjs.org link with correct attributes', () => {
      const nextjsLink = screen.getByRole('link', { name: /go to nextjs\.org/i });
      expect(nextjsLink).toBeInTheDocument();
      expect(nextjsLink).toHaveAttribute('href', 'https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
      expect(nextjsLink).toHaveAttribute('target', '_blank');
      expect(nextjsLink).toHaveAttribute('rel', 'noopener noreferrer');

      const globeIcon = screen.getByAltText('Globe icon');
      expect(globeIcon).toBeInTheDocument();
      expect(globeIcon).toHaveAttribute('src', '/globe.svg');
    });

    it('should have proper footer link styling', () => {
      const links = screen.getAllByRole('link').filter(link =>
        link.textContent?.includes('Learn') ||
        link.textContent?.includes('Examples') ||
        link.textContent?.includes('Go to nextjs.org'),
      );

      links.forEach(link => {
        expect(link).toHaveClass(
          'flex',
          'items-center',
          'gap-2',
          'hover:underline',
          'hover:underline-offset-4',
        );
      });
    });
  });

  describe('Images and Icons', () => {
    it('should render all required images with correct attributes', () => {
      const images = [
        { alt: 'Next.js logo', src: '/next.svg', width: '180', height: '38' },
        { alt: 'Vercel logomark', src: '/vercel.svg', width: '20', height: '20' },
        { alt: 'File icon', src: '/file.svg', width: '16', height: '16' },
        { alt: 'Window icon', src: '/window.svg', width: '16', height: '16' },
        { alt: 'Globe icon', src: '/globe.svg', width: '16', height: '16' },
      ];

      images.forEach(({ alt, src, width, height }) => {
        const image = screen.getByAltText(alt);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', src);
        expect(image).toHaveAttribute('width', width);
        expect(image).toHaveAttribute('height', height);
      });
    });

    it('should have aria-hidden attribute on decorative icons', () => {
      const decorativeIcons = [
        screen.getByAltText('File icon'),
        screen.getByAltText('Window icon'),
        screen.getByAltText('Globe icon'),
      ];

      decorativeIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should have proper link accessibility attributes', () => {
      const externalLinks = screen.getAllByRole('link');

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should have meaningful alt text for images', () => {
      const meaningfulAltTexts = [
        'Next.js logo',
        'Vercel logomark',
        'File icon',
        'Window icon',
        'Globe icon',
      ];

      meaningfulAltTexts.forEach(altText => {
        expect(screen.getByAltText(altText)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design Classes', () => {
    it('should have responsive classes on main container', () => {
      const container = screen.getByRole('main').parentElement;
      expect(container).toHaveClass('p-8', 'pb-20', 'gap-16', 'sm:p-20');
    });

    it('should have responsive classes on main content', () => {
      const main = screen.getByRole('main');
      expect(main).toHaveClass('items-center', 'sm:items-start');
    });

    it('should have responsive classes on instruction text', () => {
      const list = screen.getByRole('list');
      expect(list).toHaveClass('text-center', 'sm:text-left');
    });

    it('should have responsive classes on action buttons container', () => {
      const buttonsContainer = screen.getByRole('link', { name: /deploy now/i }).parentElement;
      expect(buttonsContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });
});
