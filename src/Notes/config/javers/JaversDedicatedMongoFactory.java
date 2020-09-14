package ir.donyapardaz.niopdc.base.config.javers;

import com.mongodb.*;
import com.mongodb.client.MongoDatabase;
import org.javers.common.exception.JaversException;
import org.javers.common.exception.JaversExceptionCode;
import org.javers.spring.boot.mongo.JaversMongoProperties;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class JaversDedicatedMongoFactory {
    private static String DEFAULT_HOST = "localhost";
    private static int DEFAULT_PORT = 27017;

    public static MongoDatabase createMongoDatabase(JaversMongoProperties properties, Optional<MongoClientOptions> mongoClientOptions) {
        MongoClientOptions options = mongoClientOptions.orElse(MongoClientOptions.builder().build());

        if(properties.getMongodb().getUri() != null) {
            MongoClientURI mongoClientURI = new MongoClientURI(properties.getMongodb().getUri());
            MongoClient mongoClient = new MongoClient(mongoClientURI);
            return mongoClient.getDatabase(mongoClientURI.getDatabase());
        }
        if (properties.getMongodb().getHost() != null) {
            String host = properties.getMongodb().getHost() == null ? DEFAULT_HOST
                    : properties.getMongodb().getHost();
            int port = properties.getMongodb().getPort() == null ? DEFAULT_PORT
                    : properties.getMongodb().getPort();
            List<ServerAddress> hosts = Collections
                    .singletonList(new ServerAddress(host, port));

            MongoCredential credentials = getCredentials(properties);
            MongoClient mongoClient = (credentials != null)
                    ? new MongoClient(hosts, credentials, options)
                    : new MongoClient(hosts, options);
            return mongoClient.getDatabase(properties.getMongodb().getDatabase());
        }

        throw new JaversException(JaversExceptionCode.MALFORMED_JAVERS_MONGODB_PROPERTIES);
    }

    private static boolean hasCustomCredentials(JaversMongoProperties properties) {
        return properties.getMongodb().getUsername() != null
                && properties.getMongodb().getPassword() != null;
    }

    private static MongoCredential getCredentials(JaversMongoProperties properties) {
        if (!hasCustomCredentials(properties)) {
            return null;
        }
        String username = properties.getMongodb().getUsername();
        String database = properties.getMongodb().getAuthenticationDatabase() != null
                ? properties.getMongodb().getAuthenticationDatabase() : properties.getMongodb().getDatabase();
        char[] password = properties.getMongodb().getPassword();
        return MongoCredential.createCredential(username, database, password);
    }

}
