import React from "react";
import  classNames from "classnames";

import "components/Button.scss";

export default function Button(props) {
   const classes = classNames('button',
   {"button--confirm": props.confirm,
   "button--danger": props.danger});

   return (
   <button 
      disabled={props.disabled} 
      onClick={props.onClick} 
      className={classes}
      >
         {props.children}
      </button>
   );
}
