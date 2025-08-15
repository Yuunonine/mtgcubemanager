import { useState, useEffect } from 'react';

/**
 * デバウンス機能を提供するカスタムフック
 * @param value - デバウンスする値
 * @param delay - デバウンスの遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーを設定して遅延後に値を更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ: 新しい値が来た場合や、コンポーネントがアンマウントされた場合にタイマーをクリア
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * デバウンスされたコールバック関数を提供するカスタムフック
 * @param callback - デバウンスするコールバック関数
 * @param delay - デバウンスの遅延時間（ミリ秒）
 * @param deps - 依存配列
 * @returns デバウンスされたコールバック関数
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // コンポーネントのアンマウント時にタイマーをクリア
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (...args: Parameters<T>) => {
    // 既存のタイマーがあればクリア
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 新しいタイマーを設定
    const newTimer = setTimeout(() => {
      callback(...args);
      setDebounceTimer(null);
    }, delay);

    setDebounceTimer(newTimer);
  };
}