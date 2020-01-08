import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { HistoryContext } from './HistoryProvider';
import { useActivePath } from './hooks';

export function Link(props) {
   const { history, basePath } = useContext(HistoryContext);
   const linkProps = { ...props };
   let href = String(props.href || props.to || props.path || '');
   if (history && href) {
      if (basePath) href = basePath + (basePath[basePath.length - 1] !== '/' && href[0] !== '/' ? '/' : '') + props.href;
   }
   delete linkProps.activeClassName;
   delete linkProps.strict;
   delete linkProps.to;
   delete linkProps.tag;
   linkProps.className = (linkProps.className || '') + (linkProps.className ? ' ' : '') + 'router-link';

   const onClick = e => {
      if (!history || props.target) return;
      if (e.preventDefault) e.preventDefault();
      history.push(href);
   };
   const isActive = useActivePath(href, history, props.strict);
   const activeClass = props.activeClassName || 'active';

   if (isActive && props.activeClassName!==false) {
      linkProps.className += ' ' + activeClass;
   }

   //custom tag type
   const TagType = props.tag || (props.href && 'a') || 'div';
   if (TagType && TagType !== 'a') {
      delete linkProps.href;
      delete linkProps.target;
   }

   return (
      <TagType {...linkProps} onClick={onClick}>
         {props.children}
      </TagType>
   );
}
Link.propTypes = {
   href: PropTypes.string,
   to: PropTypes.string,
   target: PropTypes.string,
   onClick: PropTypes.func,
   className: PropTypes.string,
   activeClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
   strict: PropTypes.bool
};
