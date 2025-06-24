
import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useTags() {
  const {
    tags,
    loading,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
  } = useFinance();

  // useEffect(() => {
  //   if (tags.length === 0 && !loading.tags) {
  //     loadTags();
  //   }
  // }, []);

  return {
    tags,
    loading: loading.tags,
    createTag,
    updateTag,
    deleteTag,
    refetch: loadTags,
  };
}
