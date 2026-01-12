import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DEFAULT_GYM_SVG } from '../lib/defaultGymLayout';

interface GymLayoutSelectorProps {
  onSectorSelect: (sector: string) => void;
  selectedSector?: string;
  className?: string;
}

export const GymLayoutSelector = ({
  onSectorSelect,
  selectedSector,
  className = '',
}: GymLayoutSelectorProps) => {
  const [svgContent, setSvgContent] = useState<string>(DEFAULT_GYM_SVG);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newIsDark = document.documentElement.classList.contains('dark');
      setIsDark(newIsDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchGymLayout = async () => {
      try {
        setLoading(true);
        // Use public endpoint that doesn't require admin auth
        const response = await axios.get('http://localhost:3000/api/gym-layout/active');

        if (response.data && response.data.svgContent) {
          setSvgContent(response.data.svgContent);
        } else {
          setSvgContent(DEFAULT_GYM_SVG);
        }
      } catch (err) {
        // Fallback to default SVG if fetch fails
        setSvgContent(DEFAULT_GYM_SVG);
      } finally {
        setLoading(false);
      }
    };

    fetchGymLayout();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Configure SVG dimensions and scaling
    const svgElement = container.querySelector('svg');

    if (svgElement) {
      svgElement.style.width = '100%';
      svgElement.style.height = 'auto';
      svgElement.style.maxHeight = '400px';
      svgElement.style.display = 'block';
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    const sectorPaths = container.querySelectorAll('.sector-path, .sector-zone');

    const handleClick = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      const sector = target.getAttribute('data-sector');
      if (sector) {
        onSectorSelect(sector);
      }
    };

    // Add click handlers
    sectorPaths.forEach((path) => {
      path.addEventListener('click', handleClick);
    });

    // Cleanup
    return () => {
      sectorPaths.forEach((path) => {
        path.removeEventListener('click', handleClick);
      });
    };
  }, [svgContent, onSectorSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const sectorElements = container.querySelectorAll('.sector-path, .sector-zone');

    // Update visual state based on selected sector and theme
    sectorElements.forEach((element) => {
      const svgElement = element as SVGElement;
      const sector = svgElement.getAttribute('data-sector');

      if (sector === selectedSector) {
        // Selected - high contrast stroke based on theme using inline styles
        const selectedStroke = isDark ? '#ffffff' : '#000000';
        svgElement.style.stroke = selectedStroke;
        svgElement.style.strokeWidth = '2';
        svgElement.style.fillOpacity = '0.9';
      } else {
        // Unselected - dimmed
        const unselectedStroke = isDark ? '#4b5563' : '#d1d5db';
        svgElement.style.stroke = unselectedStroke;
        svgElement.style.strokeWidth = '1';
        svgElement.style.fillOpacity = '0.4';
      }
    });
  }, [selectedSector, svgContent, isDark]);

  if (loading) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-mono-600 dark:text-mono-400">
          Loading gym layout...
        </div>
      </div>
    );
  }

  return (
    <div className={`gym-layout-selector ${className}`}>
      <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
        Sélectionnez le secteur sur le plan :
      </label>

      <div
        ref={containerRef}
        className="border-2 border-mono-200 dark:border-mono-800 rounded-xl p-4 bg-white dark:bg-mono-900 overflow-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {selectedSector && (
        <div className="mt-3 text-sm text-mono-700 dark:text-mono-300">
          Secteur sélectionné :{' '}
          <span className="font-bold text-mono-900 dark:text-white">
            {selectedSector}
          </span>
        </div>
      )}
    </div>
  );
};
