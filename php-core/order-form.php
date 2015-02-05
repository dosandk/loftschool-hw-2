<?php

    $post = (!empty($_POST)) ? true : false;
    $data = array();

    if ($post) {
        $result = array();

        $result['userName'] = stripcslashes($_POST['userName']);
        $result['userPhoneNumber'] = stripcslashes($_POST['userPhoneNumber']);
        $result['userMessage'] = stripcslashes($_POST['userMessage']);

        $result['email'] = 'dosandk@rambler.ru';

        if (filter_var($result['email'], FILTER_VALIDATE_EMAIL)){

            require_once 'libs/PHPMailerAutoload.php';
            $mail = new PHPMailer();

            $mail->isSMTP();
            $mail->Host = 'smtp.rambler.ru';
            $mail->SMTPAuth = true;
            $mail->Username = 'loftschool@rambler.ru';
            $mail->Password = 'loftschool';
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->CharSet = 'UTF-8';

            $mail->From = 'loftschool@rambler.ru';
            $mail->FromName = 'Сообщение с сайта';
            $mail->addAddress($result['email'], $result['userName']);

            $mail->WordWrap = 80;
            $mail->Subject = 'Заказ звонка';
            $mail->Body = $result['userMessage'];

            if($mail->send()){
                $data['status'] = 'OK';
                $data['message'] = "Письмо успешно отправлено";
            } else {
                $data['status'] = 'NO';
                $data['message'] = $mail->ErrorInfo;
            }
        } else {
            $data['status'] = 'NO';
            $data['message'] = "Правильно заполните поле e-mail";
        }

    } else {
        $data['status'] = 'NO';
        $data['message'] = 'Internal Server Booboo';

        header('HTTP/1.1 500 Internal Server Booboo');
    }

    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode($data));


