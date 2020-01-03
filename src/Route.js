import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const Route = React.memo(function({ children, path, url, col, cols, direction, animation, className, animationDuration, animationInitDuration, animationInitDelay }) {
   const [animate, setAnimate] = useState();
   const animTO = useRef();
   useEffect(() => {
      let additionalColsDelay = 0;
      if((direction==='same' || direction===undefined) && cols>1) additionalColsDelay = (cols-col-1)*animationInitDelay;
      setAnimate(undefined);
      if (animTO && animTO.current) animTO.current = clearTimeout(animTO.current);
      animTO.current = setTimeout(() => {
         setAnimate('entering');

         if (animTO && animTO.current) animTO.current = clearTimeout(animTO.current);
         animTO.current = setTimeout(() => {
            animTO.current = undefined;
            setAnimate('entered');
         }, animationDuration);
      }, animationInitDuration + additionalColsDelay);

      return () => {
         if (animTO && animTO.current) {
            animTO.current = clearTimeout(animTO.current);
         }
      };
   }, [direction, animation, url, path, animationDuration, animationInitDuration]); // eslint-disable-line react-hooks/exhaustive-deps

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
   animationInitDuration: PropTypes.number,
   animationInitDelay: PropTypes.number
};
Route.defaultProps = {
   animationDuration: 750,
   animationInitDuration: 25,
   animationInitDelay: 55,
};
