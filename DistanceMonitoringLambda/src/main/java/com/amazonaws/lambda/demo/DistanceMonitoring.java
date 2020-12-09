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
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class DistanceMonitoring implements RequestHandler<Object, String> {

	@Override
    public String handleRequest(Object input, Context context) {
        context.getLogger().log("Input: " + input);
        String json = ""+input;
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(json);
        JsonElement state = element.getAsJsonObject().get("state");
        JsonElement reported = state.getAsJsonObject().get("reported");
        String sparespace = reported.getAsJsonObject().get("SpareSpace").getAsString();
        double sp_space = Double.valueOf(sparespace);

        final String AccessKey="AKIA6C636WZXKYT6KC5Z";
        final String SecretKey="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";
        final String topicArn="arn:aws:sns:ap-northeast-2:968439543406:temerature_warning_topic";

        BasicAWSCredentials awsCreds = new BasicAWSCredentials(AccessKey, SecretKey);  
        AmazonSNS sns = AmazonSNSClientBuilder.standard()
                    .withRegion(Regions.AP_NORTHEAST_2)
                    .withCredentials( new AWSStaticCredentialsProvider(awsCreds) )
                    .build();

        final String msg = "*Spare Space Critical*\n" + "Remaining space in wastebasket " + sp_space + "cm";
        final String subject = "Critical Warning";
        if (sp_space <= 7.0) {
            PublishRequest publishRequest = new PublishRequest(topicArn, msg, subject);
            PublishResult publishResponse = sns.publish(publishRequest);
        }

        return subject+ "Remaining space = " + sparespace + "!";
    }
}
