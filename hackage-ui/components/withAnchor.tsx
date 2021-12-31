import { ReactNode } from "react";

// Fixes wrong scroll position with html anchors.
const withAnchor = (anchor: string, el: ReactNode): ReactNode => {
  return (
    <>
      <div id={anchor} style={{ height: '80rem' }}></div>
      {el}
    </>
  )
}

export default withAnchor;
