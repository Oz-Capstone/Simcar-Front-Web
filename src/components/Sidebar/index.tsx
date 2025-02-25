import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navigate = useNavigate();

  // 선택된 필터 상태
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const brands = ['현대', '기아', 'BMW', '벤츠', '아우디', '볼보', '토요타'];
  const carTypes = ['경차', '소형', '중형', '대형', 'SUV', '승합차'];
  const fuelTypes = ['가솔린', '디젤', '전기', '하이브리드', 'LPG'];
  const colors = ['검정', '흰색', '회색', '빨강', '파랑', '기타'];

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleToggleCarType = (type: string) => {
    setSelectedCarTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleToggleFuelType = (fuelType: string) => {
    setSelectedFuelTypes((prev) => {
      if (prev.includes(fuelType)) {
        return prev.filter((ft) => ft !== fuelType);
      } else {
        return [...prev, fuelType];
      }
    });
  };

  const handleToggleColor = (color: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleApplyFilter = () => {
    const filterParams = new URLSearchParams();

    // 선택된 필터가 하나도 없으면 검색 페이지로 이동
    if (
      selectedBrands.length === 0 &&
      selectedCarTypes.length === 0 &&
      selectedFuelTypes.length === 0 &&
      selectedColors.length === 0
    ) {
      navigate('/search');
      return;
    }

    // 브랜드 필터 - searchTerm으로 전달
    if (selectedBrands.length > 0) {
      filterParams.append('searchTerm', selectedBrands.join(' '));
    }

    // 차종 필터 - 직접 검색어에 추가
    if (selectedCarTypes.length > 0) {
      // 이미 searchTerm이 있으면 공백과 함께 추가
      const currentSearchTerm = filterParams.get('searchTerm') || '';
      filterParams.set(
        'searchTerm',
        currentSearchTerm
          ? `${currentSearchTerm} ${selectedCarTypes.join(' ')}`
          : selectedCarTypes.join(' ')
      );
    }

    // 연료 필터 - fuelTypes 파라미터로 전달
    if (selectedFuelTypes.length > 0) {
      filterParams.append('fuelTypes', selectedFuelTypes.join(','));
    }

    // 색상 필터 - colors 파라미터로 전달
    if (selectedColors.length > 0) {
      filterParams.append('colors', selectedColors.join(','));
    }

    navigate(`/search?${filterParams.toString()}`);
  };

  return (
    <div
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}
    >
      <aside className='bg-white shadow-lg h-full overflow-y-auto p-6'>
        <div className='space-y-8'>
          {/* 제조사 필터 */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>제조사</h3>
            <div className='grid grid-cols-2 gap-3'>
              {brands.map((brand) => (
                <label key={brand} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-600 rounded'
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleToggleBrand(brand)}
                  />
                  <span className='text-gray-700'>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 차종 필터 */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>차종</h3>
            <div className='grid grid-cols-2 gap-3'>
              {carTypes.map((type) => (
                <label key={type} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-600 rounded'
                    checked={selectedCarTypes.includes(type)}
                    onChange={() => handleToggleCarType(type)}
                  />
                  <span className='text-gray-700'>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 연료 필터 */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>연료</h3>
            <div className='grid grid-cols-2 gap-3'>
              {fuelTypes.map((fuel) => (
                <label key={fuel} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-600 rounded'
                    checked={selectedFuelTypes.includes(fuel)}
                    onChange={() => handleToggleFuelType(fuel)}
                  />
                  <span className='text-gray-700'>{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 색상 필터 */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>색상</h3>
            <div className='grid grid-cols-2 gap-3'>
              {colors.map((color) => (
                <label key={color} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-600 rounded'
                    checked={selectedColors.includes(color)}
                    onChange={() => handleToggleColor(color)}
                  />
                  <span className='text-gray-700'>{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 필터 적용 버튼 */}
          <button
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
            onClick={handleApplyFilter}
          >
            필터 적용
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
