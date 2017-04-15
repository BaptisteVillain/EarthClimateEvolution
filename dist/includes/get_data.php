<?php
	
	$query = $pdo->query('SELECT * FROM earth_temperature');
	$data  = $query->fetchAll();

	for($i = 0; $i < sizeof($data); $i++) {

		$data[$i]->values = [$data[$i]->month_jan, $data[$i]->month_feb, $data[$i]->month_mar, $data[$i]->month_may, $data[$i]->month_apr, $data[$i]->month_jun, $data[$i]->month_jul, $data[$i]->month_aug, $data[$i]->month_sep, $data[$i]->month_oct, $data[$i]->month_nov, $data[$i]->month_dec];
		$data[$i]->sum = ($data[$i]->month_jan + $data[$i]->month_feb + $data[$i]->month_mar + $data[$i]->month_may + $data[$i]->month_apr + $data[$i]->month_jun + $data[$i]->month_jul + $data[$i]->month_aug + $data[$i]->month_sep + $data[$i]->month_oct + $data[$i]->month_nov + $data[$i]->month_dec)/sizeof($data[$i]->values);
		
		unset($data[$i]->month_jan);
		unset($data[$i]->month_feb);
		unset($data[$i]->month_mar);
		unset($data[$i]->month_apr);
		unset($data[$i]->month_may);
		unset($data[$i]->month_jun);
		unset($data[$i]->month_jul);
		unset($data[$i]->month_aug);
		unset($data[$i]->month_sep);
		unset($data[$i]->month_oct);
		unset($data[$i]->month_nov);
		unset($data[$i]->month_dec);
		unset($data[$i]->id);

	}

