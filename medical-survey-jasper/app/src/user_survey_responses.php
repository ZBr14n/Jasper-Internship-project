<?php

function getRecentPosts(){
  $args = array( 
    'numberposts' => '1', 
  );
  $recent_posts = wp_get_recent_posts( $args );
  foreach( $recent_posts as $recent ):

    $post_id        = $recent['ID'];
    // $post_url       = get_permalink($recent['ID']);
    // $post_title     = $recent['post_title'];
    $post_content   = $recent['post_content'];
    // $post_thumbnail = get_the_post_thumbnail($recent['ID']);

  endforeach;

  return $recent_posts[0]["post_content"];
}



function store_survey_responses(){
  
  $storeSurveyResponses = array();
  $decoded = null;
  
  
  $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
  
  if ($contentType === "application/json") {
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);    
  }
  
  //loop thru the keys/values of the JSON data from the frontend.
  foreach($decoded as $key=>$value){
    array_push($storeSurveyResponses, $key . ": " . $value);
  }
  

  // insert new posts with all the details from above.  
  $postTitle = get_page_by_title( $storeSurveyResponses[0], OBJECT , 'post' );
  // $getPostID = $postTitle->ID;
  if('publish' !== get_post_status( $postTitle->ID )){
    wp_insert_post(
      array(
        'post_title' => 'user quiz response',
        'post_content' => $storeSurveyResponses[0] . '|' . $storeSurveyResponses[1] . '|' . $storeSurveyResponses[2] . '|' . $storeSurveyResponses[3] . '|' . $storeSurveyResponses[4] . '|' . $storeSurveyResponses[5] . '|' . $storeSurveyResponses[6],
        'post_type' => 'post',
        'post_status' => 'publish'
      )
    );
  }

  // return array('storeSurveyResponses' => $storeSurveyResponses, 'status' => 'callback completed');
// return rest_ensure_response( $storeSurveyResponses[0] . " " . $storeSurveyResponses[1] );
  
  // return array('getRecentPosts' => getRecentPosts(),'$storeSurveyResponses[0]' => $storeSurveyResponses[0], '$storeSurveyResponses[1]' => $storeSurveyResponses[1], '$storeSurveyResponses[3]' => $storeSurveyResponses[3], '$storeSurveyResponses[4]' => $storeSurveyResponses[4] );

  // return rest_ensure_response( strval(getRecentPosts()) );
  // return rest_ensure_response('fafadfa works');

  return getRecentPosts();
}
    

add_action('rest_api_init',function(){
  // WP_REST_SERVER::EDITABLE
  // ALLMETHODS      READABLE
    register_rest_route('user-survey-responses/v1','/store',array(
        'methods' => WP_REST_Server::ALLMETHODS,
        'callback' => 'store_survey_responses'
    ));
});


?>