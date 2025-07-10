import { useRouter } from "next/router";
import { cookieManager } from "../utils/cookieManager";

export const useSearch = () => {
  const router = useRouter();

  const formatSearchLink = (searchValue) => {
    return searchValue
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("+");
  };

  const navigateToSearch = (searchValue) => {
    const link = formatSearchLink(searchValue);
    router.push(
      "/peraturan?q=All/" + link, 
      "/produk-hukum/All/" + link, 
      { shallow: true }
    );
  };

  const handleSearch = (searchValue) => {
    cookieManager.clearSearchCookies();
    navigateToSearch(searchValue);
  };

  const handleKeyPress = (event) => {
    const searchValue = event.target.value;
    
    if (event.keyCode === 13) {
      cookieManager.clearSearchCookies();
      navigateToSearch(searchValue);
      event.preventDefault();
    }
  };

  return {
    handleSearch,
    handleKeyPress,
    formatSearchLink
  };
};