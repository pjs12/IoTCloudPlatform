package com.amazonaws.lambda.demo;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;

public class TrashSNSTest implements RequestHandler<Object, String> {

	@Override
    public String handleRequest(Object input, Context context) {
        context.getLogger().log("Input: " + input);

        final String AccessKey="AKIA6C636WZXKYT6KC5Z";
        final String SecretKey="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";
        final String topicArn="arn:aws:sns:ap-northeast-2:968439543406:MyTopic"; // 이전 단계에서 생성한 SNS 주제에 대한 Arn을 지정

        BasicAWSCredentials awsCreds = new BasicAWSCredentials(AccessKey, SecretKey);  
        AmazonSNS sns = AmazonSNSClientBuilder.standard()
                    .withRegion(Regions.AP_NORTHEAST_2)
                    .withCredentials( new AWSStaticCredentialsProvider(awsCreds) )
                    .build();

        String msg = "If you receive this message, publishing a message to an Amazon SNS topic works.";
        String subject = ""+input;
        PublishRequest publishRequest = new PublishRequest(topicArn, msg, subject);
        PublishResult publishResponse = sns.publish(publishRequest);

        // TODO: implement your handler
        return "SNS completed from Lambda!";
    }

}
