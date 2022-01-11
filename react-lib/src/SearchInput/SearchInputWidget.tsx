import React, { HTMLAttributes } from 'react';
import { DefaultAppContextProvider } from "../AppContext/AppContext";
import { SearchInput, SearchInputProps } from "./SearchInput";

export const SearchInputWidget = (props: { containerProps?: HTMLAttributes<HTMLDivElement>, searchInputProps: SearchInputProps }) => {
  return (
    <DefaultAppContextProvider useNextJSRouting={false}>
      <div {...props.containerProps}>
        <SearchInput {...props.searchInputProps} />
      </div>
    </DefaultAppContextProvider>
  );
}
