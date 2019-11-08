import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const Route = React.memo(function({ children, path, url, col, cols, direction, animation, className, animationDuration, animationInitDuration }) {
   const [animate, setAnimate] = useState();
   const animTO = useRef();
   useEffect(() => {
      setAnimate(undefined);
      if (animTO && animTO.current) animTO.current = clearTimeout(animTO.current);
      animTO.current = setTimeout(() => {
         setAnimate('entering');

         if (animTO && animTO.current) animTO.current = clearTimeout(animTO.current);
         animTO.current = setTimeout(() => {
            animTO.current = undefined;
            setAnimate('entered');
         }, animationDuration);
      }, animationInitDuration);

      return () => {
         if (animTO && animTO.current) {
            animTO.current = clearTimeout(animTO.current);
         }
      };
   }, [direction, animation, url, path, animationDuration, animationInitDuration]);

   let cl = 'route col-' + (col || 0) + ' cols-' + (cols || 1);
   if (className) cl += ' ' + className;
   if (animation !== false) cl += ' animation-' + (animation || 'default');
   if (animation !== false && direction) cl += ' direction-' + direction;

   if (animate && animate !== 'entered') cl += ' ' + animate;
   else if (!animate && animate !== false) cl += ' will-enter';

   return <div className={cl}>{children}</div>;
});
Route.propTypes = {
   children: PropTypes.node.isRequired,
   col: PropTypes.number.isRequired,
   path: PropTypes.string,
   url: PropTypes.string,
   cols: PropTypes.number,
   direction: PropTypes.string,
   animation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
   className: PropTypes.string,
   animationDuration: PropTypes.number,
   animationInitDuration: PropTypes.number
};
Route.defaultProps = {
   animationDuration: 750,
   animationInitDuration: 50
};
