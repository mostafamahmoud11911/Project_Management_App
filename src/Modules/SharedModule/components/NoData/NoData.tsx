import React from 'react'
import noDataImg from "../../../../assets/images/no-data.png";
import noDataPic from "../../../../assets/images/nodatabg.png";
import Styles from "./NoData.module.css"


export default function NoData() {
  return (
    <div className='text-center p-4'>
        <img 
        className={`${Styles.resize} img-fluid my-3`}
        src={noDataPic} 
        alt="Responsive image"
         />
        <h3>No Data!</h3>
        </div>
  )
}
