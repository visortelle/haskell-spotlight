import React from 'react';
import { DefaultAppContextProvider } from "../AppContext/AppContext";
import { SearchInput } from "./SearchInput";

const SearchInputWidget = () => {
  return (
    <DefaultAppContextProvider>
      <SearchInput />
    </DefaultAppContextProvider>
  );
}

export default SearchInputWidget;
