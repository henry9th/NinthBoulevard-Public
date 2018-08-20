<?php
error_log("UploadToServer.php called");
$target_path = 'uploads/';

$target_path = $target_path . basename($_FILES['uploaded_file']['name']);

if(move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $target_path)) {
echo 'The file '. basename( $_FILES['uploaded_file']['name']).
' has been uploaded';
} else{
echo "There was an error uploading the file, please try again!";
}

	//Parse answer file
	$ans_file = fopen($target_path, 'r') or die('Unable to open file');
	$ans_text = fread($ans_file, filesize($target_path));
	$title_line = explode("\n",$ans_text);
	require_once 'answer_check/DB_Functions.php';

	$db = new DB_Functions();

	// read the public key
	$public_key = openssl_pkey_get_public(file_get_contents('public_key.pem'));
	$public_key_details = openssl_pkey_get_details($public_key);
	// there are 11 bytes overhead for PKCS1 padding
	$encrypt_chunk_size = ceil($public_key_details['bits'] / 8) - 11;

	#$ans_text = $ans_encrypted;

	function rsa_encryption($plain_text, $encrypt_chunk_size, $public_key) {
		$output = '';
		// loop through the long plain text, and divide by chunks
		while ($plain_text) {
		    $chunk = substr($plain_text, 0, $encrypt_chunk_size);
		    $plain_text = substr($plain_text, $encrypt_chunk_size);
		    $encrypted = '';
		    if (!openssl_public_encrypt($chunk, $encrypted, $public_key))
		        die('Failed to encrypt data');
		    $output .= $encrypted;
		}
		return base64_encode($output);
	}

	//$unique_id = $title_line[0];

	// put all answers into array
$ans_array_noencrypt = array('q1'=>$title_line[0], 'q2'=>$title_line[1],
   'q3'=>$title_line[2], 'q4'=>$title_line[3],
   'q5'=>$title_line[4], 'q6'=>$title_line[5],
   'q7'=>$title_line[6], 'q8'=>$title_line[7],
   'q9'=>$title_line[8], 'q10'=>$title_line[9],
	 'q11'=>$title_line[10], 'q12'=>$title_line[11],
	 'q13'=>$title_line[12], 'q14'=>$title_line[13],
	 'q15'=>$title_line[14], 'q16'=>$title_line[15],
	 'q17'=>$title_line[16], 'q18'=>$title_line[17],
	 'q19'=>$title_line[18], 'q20'=>$title_line[19],
	 'q21'=>$title_line[20], 'q22'=>$title_line[21],
	 'q23'=>$title_line[22], 'q24'=>$title_line[23],
	 'q25'=>$title_line[24], 'q26'=>$title_line[25],
	 'q27'=>$title_line[26], 'q28'=>$title_line[27],
	 'q29'=>$title_line[28], 'q30'=>$title_line[29],
	 'q31'=>$title_line[30], 'q32'=>$title_line[31],
	 'q33'=>$title_line[32],'q34'=>$title_line[33],
 'q35'=>$title_line[34],'q36'=>$title_line[35],'q37'=>$title_line[36],
'q38'=>$title_line[37],'q39'=>$title_line[38],'q40'=>$title_line[39],
'q41'=>$title_line[40],'q42'=>$title_line[41],'q43'=>$title_line[42],
'q44'=>$title_line[43],'q45'=>$title_line[44],'q46'=>$title_line[45],
'q47'=>$title_line[46],'q48'=>$title_line[47],'q49'=>$title_line[48],
'q50'=>$title_line[49],'q51'=>$title_line[50],'q52'=>$title_line[51],
'q53'=>$title_line[52],'q54'=>$title_line[53],'q55'=>$title_line[54],
'q56'=>$title_line[55],'q57'=>$title_line[56],'q58'=>$title_line[57],
'q59'=>$title_line[58]);

	$insert_id = $db->storeRecords($title_line[59], $title_line[60], $title_line[61], $title_line[62], $title_line[63], $title_line[64], $title_line[65],
	$title_line[66], $title_line[67], $title_line[68], $title_line[69], $title_line[70]);

	$ans_array = array('survey_answer_counter'=>(string)$insert_id, 'q1'=>rsa_encryption($title_line[0],$encrypt_chunk_size, $public_key), 'q2'=>rsa_encryption($title_line[1],$encrypt_chunk_size, $public_key),
	   'q3'=>rsa_encryption($title_line[2],$encrypt_chunk_size, $public_key), 'q4'=>rsa_encryption($title_line[3],$encrypt_chunk_size, $public_key),
	   'q5'=>rsa_encryption($title_line[4],$encrypt_chunk_size, $public_key), 'q6'=>rsa_encryption($title_line[5],$encrypt_chunk_size, $public_key),
	   'q7'=>rsa_encryption($title_line[6],$encrypt_chunk_size, $public_key), 'q8'=>rsa_encryption($title_line[7],$encrypt_chunk_size, $public_key),
	   'q9'=>rsa_encryption($title_line[8],$encrypt_chunk_size, $public_key), 'q10'=>rsa_encryption($title_line[9],$encrypt_chunk_size, $public_key),
		 'q11'=>rsa_encryption($title_line[10],$encrypt_chunk_size, $public_key), 'q12'=>rsa_encryption($title_line[11],$encrypt_chunk_size, $public_key),
		 'q13'=>rsa_encryption($title_line[12],$encrypt_chunk_size, $public_key), 'q14'=>rsa_encryption($title_line[13],$encrypt_chunk_size, $public_key),
		 'q15'=>rsa_encryption($title_line[14],$encrypt_chunk_size, $public_key), 'q16'=>rsa_encryption($title_line[15],$encrypt_chunk_size, $public_key),
		 'q17'=>rsa_encryption($title_line[16],$encrypt_chunk_size, $public_key), 'q18'=>rsa_encryption($title_line[17],$encrypt_chunk_size, $public_key),
		 'q19'=>rsa_encryption($title_line[18],$encrypt_chunk_size, $public_key), 'q20'=>rsa_encryption($title_line[19],$encrypt_chunk_size, $public_key),
		 'q21'=>rsa_encryption($title_line[20],$encrypt_chunk_size, $public_key), 'q22'=>rsa_encryption($title_line[21],$encrypt_chunk_size, $public_key),
		 'q23'=>rsa_encryption($title_line[22],$encrypt_chunk_size, $public_key), 'q24'=>rsa_encryption($title_line[23],$encrypt_chunk_size, $public_key),
		 'q25'=>rsa_encryption($title_line[24],$encrypt_chunk_size, $public_key), 'q26'=>rsa_encryption($title_line[25],$encrypt_chunk_size, $public_key),
		 'q27'=>rsa_encryption($title_line[26],$encrypt_chunk_size, $public_key), 'q28'=>rsa_encryption($title_line[27],$encrypt_chunk_size, $public_key),
		 'q29'=>rsa_encryption($title_line[28],$encrypt_chunk_size, $public_key), 'q30'=>rsa_encryption($title_line[29],$encrypt_chunk_size, $public_key),
		 'q31'=>rsa_encryption($title_line[30],$encrypt_chunk_size, $public_key), 'q32'=>rsa_encryption($title_line[31],$encrypt_chunk_size, $public_key),
		 'q33'=>rsa_encryption($title_line[32],$encrypt_chunk_size, $public_key),'q34'=>rsa_encryption($title_line[33],$encrypt_chunk_size, $public_key),
		 'q35'=>rsa_encryption($title_line[34],$encrypt_chunk_size, $public_key),'q36'=>rsa_encryption($title_line[35],$encrypt_chunk_size, $public_key),
		 'q37'=>rsa_encryption($title_line[36],$encrypt_chunk_size, $public_key),'q38'=>rsa_encryption($title_line[37],$encrypt_chunk_size, $public_key),
		 'q39'=>rsa_encryption($title_line[38],$encrypt_chunk_size, $public_key),'q40'=>rsa_encryption($title_line[39],$encrypt_chunk_size, $public_key),
		 'q41'=>rsa_encryption($title_line[40],$encrypt_chunk_size, $public_key),'q42'=>rsa_encryption($title_line[41],$encrypt_chunk_size, $public_key),
		 'q43'=>rsa_encryption($title_line[42],$encrypt_chunk_size, $public_key),'q44'=>rsa_encryption($title_line[43],$encrypt_chunk_size, $public_key),
		 'q45'=>rsa_encryption($title_line[44],$encrypt_chunk_size, $public_key),'q46'=>rsa_encryption($title_line[45],$encrypt_chunk_size, $public_key),
		 'q47'=>rsa_encryption($title_line[46],$encrypt_chunk_size, $public_key),'q48'=>rsa_encryption($title_line[47],$encrypt_chunk_size, $public_key),
		 'q49'=>rsa_encryption($title_line[48],$encrypt_chunk_size, $public_key),'q50'=>rsa_encryption($title_line[49],$encrypt_chunk_size, $public_key),
		 'q51'=>rsa_encryption($title_line[50],$encrypt_chunk_size, $public_key),'q52'=>rsa_encryption($title_line[51],$encrypt_chunk_size, $public_key),
		 'q53'=>rsa_encryption($title_line[52],$encrypt_chunk_size, $public_key),'q54'=>rsa_encryption($title_line[53],$encrypt_chunk_size, $public_key),
		 'q55'=>rsa_encryption($title_line[54],$encrypt_chunk_size, $public_key),'q56'=>rsa_encryption($title_line[55],$encrypt_chunk_size, $public_key),
		 'q57'=>rsa_encryption($title_line[56],$encrypt_chunk_size, $public_key),'q58'=>rsa_encryption($title_line[57],$encrypt_chunk_size, $public_key),
		 'q59'=>rsa_encryption($title_line[58],$encrypt_chunk_size, $public_key));

	$db->storeToFullTable($ans_array);
	$db->writeToCSV($insert_id,$title_line, $ans_array);
	openssl_free_key($public_key);

	echo "yes";

?>
