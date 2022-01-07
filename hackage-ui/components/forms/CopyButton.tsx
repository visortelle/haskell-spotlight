import AppContext from '../AppContext';
import { useContext } from 'react';
import contentCopyIcon from '!!raw-loader!../icons/content-copy.svg';
import SvgIcon from '../icons/SVGIcon';
import s from './CopyButton.module.css';

export type CopyButtonProps = {
  copyText: string,
  displayText: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const appContext = useContext(AppContext);

  return (
    <div
      className={s.copyButton}
      style={props.displayText ? {} : { width: '32rem', height: '32rem', padding: '0', justifyContent: 'center' }}
      onClick={() => {
        navigator.clipboard.writeText(props.copyText);
        appContext.notifySuccess('Copied to clipboard!');
      }}
    >
      {props.displayText && <code className={s.copyButtonText}>{props.displayText}</code>}
      <div
        className={s.copyButtonIcon}
        style={props.displayText ? {} : { marginLeft: 0, position: 'static' }}
      >
        <SvgIcon svg={contentCopyIcon} />
      </div>
    </div>
  );
}

export default CopyButton;
