import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { HistoryContext } from './HistoryProvider';
import { usePathIsActive } from './hooks';

export function Link(props) {
   const { history, basePath } = useContext(HistoryContext);
   const linkProps = { ...props };
   let href = String(props.href||'');
   if (history && href) {
      if (basePath) href = basePath + (basePath[basePath.length - 1] !== '/' && href[0] !== '/' ? '/' : '') + props.href;
   }

   const onClick = (e) => {
      if (!history || props.target) return;
      if (e.preventDefault) e.preventDefault();
      history.push(props.href);
   };
   const isActive = usePathIsActive(href, history);
   const activeClass = props.activeClassName || 'active';

   if (isActive) {
      linkProps.className = !props.className ? activeClass : props.className + ' ' + activeClass;
   }

   return (
      <a {...linkProps} href={href} onClick={onClick}>
         {props.children}
      </a>
   );
}
Link.propTypes = {
   href: PropTypes.string.isRequired,
   target: PropTypes.string,
   onClick: PropTypes.func,
   className: PropTypes.string,
   activeClassName: PropTypes.string
};