<?php
/**
 * Plugin.
 *
 * @package embeded-react-app-in-wp
 * @wordpress-plugin
 *
 * Plugin Name:     Jasper-Directory
 * Description:     Jasper Directory React App Embedded into WordPress page
 * Author:          Brian Lam
 * Author URL:      brianl@jasperhelps.email
 * Version:         0.1
 * Domain Path:     /languages
 */

 

/**
 * Shortcode which renders Root element for your React App.
 *
 * @return string
 */

// ! Prad's code
$pid = 0;
function directory_get_user_info()
{
	// use WordPress built-in function to get user data
	$userdata = wp_get_current_user()->{'data'};
	$userID = $userdata->{'ID'};
	$pid = $userID;
	// here is the information that will be passed into the shortcode
	$userinfo = array(
		'first_name' => str_replace("\n", '', strip_tags(do_shortcode('[um_loggedin]{first_name}[/um_loggedin]'))),
		'last_name' => str_replace("\n", '', strip_tags(do_shortcode('[um_loggedin]{last_name}[/um_loggedin]'))),
		'nickname' => $userdata->{'display_name'},
		'userID' => $userID,
		'userRole' => wp_get_current_user()->{'roles'}[0],
    'providerID' => $userdata->{'providerID'},
    'image' => strip_tags(do_shortcode('[um_loggedin]{user_avatar_small}[/um_loggedin]'))
	);

	return $userinfo;
}
function get_patient_portal_data2()
{
  // getting all my booking data from the WordPress database
  global $wpdb;
  $booking_table = $wpdb->prefix . 'bookingInfo';
  $doctor_table = $wpdb->prefix . 'doctors';
  $patient_table = $wpdb->prefix . 'patients';
  $pastBookings_table = $wpdb->prefix . 'pastBookings';
  $data = array();
  $patientData = array();
  $bookingData = array();
  $doctorData = array();
  $pastBookingsData = array();
  // $docID = 0;



  // $patId = $patientIdentification;
  $patID = 10;


  // this would be determined upon login, but for now let's say we are Test Provider (providerID: 9)
  // $username = mclyne;
  // $password = "qwerty";




  $patient_results = $wpdb->get_results("SELECT * FROM $patient_table");
  foreach ($patient_results as $patient) {
    $pid = $patient->id;
    $booking_results = $wpdb->get_results("SELECT * FROM $booking_table WHERE patientID = $pid");
    foreach ($booking_results as $booking) {
      $docID = $booking->docID;
      $doctor_results = $wpdb->get_results("SELECT * FROM $doctor_table WHERE doctorID=$docID");
      // print it to the screen
      foreach ($doctor_results as $doctor) {
        $doctorData[] = array(
          'doctorID' => $doctor->doctorID,
          'Name' => $doctor->Name,
          'providerID' => $doctor->providerID
        );
      }
  
  
      $bookingData[] = array(
        'bookingID' => $booking->bookingID,
        'patient' => $booking->Name,
        'doctorID' => $booking->docID,
        'date' => $booking->date,
        'time' => $booking->time,
        'patientID' => $booking->patientID,
        'providerID' => $booking->providerID,
        'doctorInfo' => $doctorData
  
  
      );
      $doctorData = array();
    }


    $patientData[] = array(
      'id' => $patient->id,
      'patient_id' => $pid,
      'name' => $patient->name,
      'first_name' => $patient->first_name,
      'username' => $patient->username,
      'password' => $patient->password,
      'dob' => $patient->dob,
      'age' => $patient->age,
      'gender' => $patient->gender,
      'username' => $patient->username,
      'password' => $patient->password,
      'email' => $patient->email,
      'address' => $patient->address,
      'bookingInfo' => $bookingData,

    );
    $bookingData = array();
  }

  return $patientData;
}



// ! Kailey's code
function get_office_user_info2() {
	// use WordPress built-in function to get user data
	$userdata = wp_get_current_user()->{'data'};
	$user_id = $userdata->{'ID'};

	// here is the information that will be passed into the shortcode
	$userinfo = array(
		// could use $userdata to get display_name but I wanted to get the UM first_name and last_name
		'first_name' => str_replace("\n", '', strip_tags(do_shortcode('[um_loggedin]{first_name}[/um_loggedin]'))), // for some reason it can't see $_SESSION['office_id']
		'last_name' => str_replace("\n", '', strip_tags(do_shortcode('[um_loggedin]{last_name}[/um_loggedin]'))),
		'nickname' => $userdata->{'display_name'},
		'user_id' => $user_id,
		'username' => $userdata->{'user_login'},
		'overview_preferences' => get_user_meta($user_id, 'overview-preferences', true),
		'user_role' => wp_get_current_user()->{'roles'}[0],
		'office_id' => get_user_meta($user_id, 'office_id', true),
		'office_code' => get_user_meta($user_id, 'office_code', true)
	);

	return $userinfo;
}




function md_react_app_shortcode() {

	/**
	 * You can pass in here some data which if you need to have some settings\localization etc for your App,
	 * so you'll be able for example generate initial state of your app for Redux, based on some settings provided by WordPress.
	 */
	$settings = array(
		'l18n'       => array(
			'main_title' => 'Hi this is your React app running in WordPress',
		),
		'some_items' => array( 'lorem ipsum', 'dolor sit amet' ),
		'component' => array(directory_get_user_info(), get_office_user_info2(), get_patient_portal_data2())
	);
	
	return '<div id="md-react-app" data-default-settings="' . esc_attr( wp_json_encode( $settings ) ) . '"></div>';
}

add_shortcode(
	'md-react-app',
	'md_react_app_shortcode'
);

/**
 * Enqueues styles and js compiled for plugin.
 */
function directory_react_app_enqueue_assets() {

	$ver         = ( get_plugin_data( __FILE__ ) )['Version'];
	$js_to_load  = plugin_dir_url( __FILE__ ) . 'app/build/static/js/main.js';
	$css_to_load = plugin_dir_url( __FILE__ ) . 'app/build/static/css/main.css';

	if ( defined( 'ENV_DEV' ) && ENV_DEV ) {
		// DEV React dynamic loading.
		$ver         = gmdate( 'Y-m-d-h-i-s' );
		$js_to_load  = 'http://localhost:3000/static/js/main.js';
		$css_to_load = 'http://localhost:3000/static/css/main.css';
	}

	/* `wp-element` as dependency will load React and ReactDom for our app from `wp-includes` */
	wp_enqueue_script( 'md-react-app', $js_to_load, array( 'wp-element' ), $ver, true );

	wp_enqueue_style( 'md-react-app', $css_to_load, array(), $ver );

}

add_action( 'wp_enqueue_scripts', 'directory_react_app_enqueue_assets' );



// add custom endpoint to post the booking data
add_action('rest_api_init', function () {
	register_rest_route('patients/v1', '/db/', array(
	  'methods' => 'GET',
	  'callback' => 'get_patient_portal_data2'
	));
});