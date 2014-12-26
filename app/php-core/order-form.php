<?php

    $post = (!empty($_POST)) ? true : false;

    if ($post) {
        $result = array();

        $result['userName'] = stripcslashes($_POST['userName']);
        $result['userPhoneNumber'] = stripcslashes($_POST['userPhoneNumber']);
        $result['userMessage'] = stripcslashes($_POST['userMessage']);

        header('Content-Type: application/json');

        print json_encode($result);
    }