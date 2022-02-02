import React, { useEffect, useState } from 'react';

import './result-icon.css';


function ResultIcon({ color, trend }) {
    return (
        <div className="result-icon">
            <div className={`circle --${color}`}></div>
            <div className={`trend --${trend}`}></div>
            <div className={`--${trend}`}>
                <svg width="18px" height="18px" version="1.1">
                    <path d="M10.788 3.57593L16.5535 15.107Q16.5819 15.1639 16.6067 15.2224Q16.6314 15.2809 16.6524 15.3409Q16.6734 15.4009 16.6905 15.4622Q16.7077 15.5234 16.7209 15.5856Q16.7341 15.6477 16.7433 15.7106Q16.7526 15.7735 16.7578 15.8369Q16.763 15.9002 16.7642 15.9638Q16.7654 16.0273 16.7625 16.0908Q16.7596 16.1543 16.7528 16.2175Q16.7459 16.2807 16.735 16.3433Q16.7241 16.406 16.7093 16.4678Q16.6944 16.5296 16.6757 16.5903Q16.6569 16.6511 16.6344 16.7105Q16.6118 16.7699 16.5855 16.8278Q16.5592 16.8857 16.5293 16.9418Q16.4994 16.9979 16.466 17.0519Q16.4326 17.106 16.3958 17.1578Q16.359 17.2097 16.319 17.2591Q16.279 17.3085 16.2359 17.3552Q16.1928 17.402 16.1469 17.4459Q16.1009 17.4898 16.0523 17.5308Q16.0037 17.5717 15.9525 17.6094Q15.9014 17.6472 15.8479 17.6816Q15.7945 17.716 15.739 17.747Q15.6834 17.7779 15.6261 17.8053Q15.5687 17.8327 15.5097 17.8563Q15.4507 17.88 15.3903 17.8998Q15.3299 17.9197 15.2684 17.9357Q15.2069 17.9517 15.1445 17.9638Q15.0821 17.9758 15.019 17.9839Q14.9559 17.9919 14.8925 17.996Q14.8291 18 14.7655 18L3.2345 18Q3.17093 18 3.10749 17.996Q3.04405 17.9919 2.981 17.9839Q2.91795 17.9758 2.85553 17.9638Q2.79312 17.9517 2.7316 17.9357Q2.67007 17.9197 2.60969 17.8999Q2.54931 17.88 2.49031 17.8563Q2.43131 17.8327 2.37394 17.8053Q2.31656 17.7779 2.26104 17.747Q2.20552 17.716 2.15208 17.6816Q2.09864 17.6472 2.04749 17.6094Q1.99635 17.5717 1.9477 17.5308Q1.89905 17.4899 1.85311 17.4459Q1.80716 17.402 1.7641 17.3552Q1.72103 17.3085 1.68103 17.2591Q1.64102 17.2097 1.60423 17.1578Q1.56745 17.106 1.53403 17.0519Q1.50061 16.9979 1.47069 16.9418Q1.44078 16.8857 1.41449 16.8278Q1.3882 16.7699 1.36563 16.7105Q1.34307 16.6511 1.32433 16.5903Q1.30559 16.5296 1.29075 16.4678Q1.2759 16.406 1.26502 16.3433Q1.25413 16.2807 1.24725 16.2175Q1.24036 16.1543 1.2375 16.0908Q1.23465 16.0273 1.23583 15.9638Q1.23701 15.9002 1.24223 15.8369Q1.24745 15.7735 1.25669 15.7106Q1.26592 15.6477 1.27913 15.5856Q1.29234 15.5234 1.30947 15.4622Q1.32661 15.4009 1.3476 15.3409Q1.36859 15.2809 1.39335 15.2224Q1.4181 15.1639 1.44653 15.107L7.21204 3.57593Q7.24298 3.51404 7.27813 3.45444Q7.31327 3.39485 7.35246 3.33782Q7.39164 3.2808 7.43468 3.22662Q7.47771 3.17244 7.52438 3.12136Q7.57106 3.07029 7.62116 3.02256Q7.67125 2.97484 7.72453 2.93069Q7.7778 2.88655 7.834 2.84619Q7.89021 2.80583 7.94906 2.76945Q8.00792 2.73308 8.06915 2.70086Q8.13038 2.66864 8.19369 2.64073Q8.257 2.61283 8.32209 2.58936Q8.38718 2.5659 8.45374 2.54699Q8.5203 2.52808 8.588 2.51382Q8.65571 2.49956 8.72423 2.49002Q8.79276 2.48047 8.86179 2.47569Q8.93081 2.47091 9 2.47091Q9.06919 2.47091 9.13822 2.47569Q9.20724 2.48047 9.27577 2.49002Q9.3443 2.49956 9.412 2.51382Q9.4797 2.52808 9.54626 2.54699Q9.61282 2.5659 9.67791 2.58936Q9.743 2.61283 9.80631 2.64073Q9.86962 2.66864 9.93085 2.70086Q9.99208 2.73308 10.0509 2.76945Q10.1098 2.80583 10.166 2.84619Q10.2222 2.88655 10.2755 2.93069Q10.3287 2.97484 10.3788 3.02256Q10.4289 3.07029 10.4756 3.12136Q10.5223 3.17244 10.5653 3.22662Q10.6084 3.2808 10.6475 3.33782Q10.6867 3.39485 10.7219 3.45444Q10.757 3.51404 10.788 3.57593Z" id="Triangle" fill="#000000" fillRule="evenodd" stroke="none" />
                </svg>
            </div>
        </div>);
}

export default ResultIcon;