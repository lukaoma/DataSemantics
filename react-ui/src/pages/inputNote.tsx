import {TextField}                 from '@material-ui/core';
import Button                      from '@material-ui/core/Button';
import axios, {AxiosRequestConfig} from 'axios';
import React, {useState}           from 'react';
import {Observable, Observer}      from 'rxjs';

const InputNote = () => {
	const [score, setScore] = useState('');
	const [inputText, setText] = useState<string>('');
	const getEnteredPredict = () => {
		getPrediction2(btoa(inputText)).subscribe({
			next: data => setScore(old => {
				let dataString: string = data + '';
				dataString = dataString.substring(0, 5);
				const dataNumber: number = parseFloat(dataString) * 100;
				dataString = (dataNumber + '').substring(0, 4) + '%';
				return dataString;
			})
		});
	};


	const getPrediction2 = (note: string): Observable<string> => {
		const predictionPost: AxiosRequestConfig = {
			method: 'POST',
			url: document.location + 'predict',
			data: {note}
		};
		const predit = new Observable((observe: Observer<string>) => {
			axios(predictionPost).then(res => {
				console.log(res.data);
				observe.next(res.data);
			});
		});
		return predit;
	};

	return (
		<div>
			<TextField label="Please enter discharge note" variant="outlined" rows={4} style={box1}
					   onChange={text => setText(text.target.value)}/>
			<div><Button variant="contained" color="primary" onClick={getEnteredPredict} style={{marginBottom: '5%'}}>Send
				Note</Button></div>
			<h3>Score: {score ? score : 'Not Entered'}</h3>
		</div>
	);
};


const box1 = {
	width: 800,
	paddingBottom: '1%'
};


export default InputNote;
