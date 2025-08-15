import { useMemo, useState, useEffect } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // 表示領域外にレンダリングするアイテム数
}

interface VirtualizedData<T> {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
}

/**
 * 大量のリストを効率的にレンダリングするための仮想化フック
 * @param items - 全アイテムのリスト
 * @param options - 仮想化オプション
 * @param scrollTop - スクロール位置
 * @returns 仮想化されたデータ
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions,
  scrollTop: number = 0
): VirtualizedData<T> {
  const { itemHeight, containerHeight, overscan = 5 } = options;

  return useMemo(() => {
    const totalHeight = items.length * itemHeight;
    
    // 表示領域に含まれるアイテムのインデックスを計算
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    // 表示するアイテムを抽出
    const visibleItems = items.slice(startIndex, endIndex + 1);

    // オフセットを計算（スクロール位置の調整）
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight,
      offsetY
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);
}

/**
 * スムーズなスクロール位置管理のためのフック
 * @param initialValue - 初期スクロール位置
 * @returns スクロール位置とセッター関数
 */
export function useScrollPosition(initialValue: number = 0) {
  const [scrollTop, setScrollTop] = useState(initialValue);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      setScrollTop(target.scrollTop);
      setIsScrolling(true);

      // スクロール終了の検出
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
  }, []);

  return {
    scrollTop,
    isScrolling,
    handleScroll
  };
}