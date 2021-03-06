import React from 'react';

export const Modal = ({ closeModal, outline }) => {
	return (
		<div className='fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center w-full h-screen font-sans bg-teal-lightest'>
			<div className='absolute flex items-center justify-center w-full h-screen bg-modal'>
				<div className='max-w-xl max-h-full p-2 m-4 text-left bg-white rounded shadow'>
					<svg
						className='float-right text-black cursor-pointer fill-current'
						onClick={closeModal}
						xmlns='http://www.w3.org/2000/svg'
						width='18'
						height='18'
						viewBox='0 0 18 18'>
						<path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
					</svg>
					<div className='m-4'>
						<h1 className='text-xl underline'>Outline</h1>
					</div>
					<div className='m-4'>
						<ul>
							{outline.map(o => {
								if (o.startsWith("H3")) {
									return <li className='pt-1 pb-1 ml-4 text-sm'>{o}</li>;
								}
								return <li className='pt-1 pb-1 font-bold'>{o}</li>;
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
