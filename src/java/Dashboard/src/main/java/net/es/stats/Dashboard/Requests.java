package net.es.stats.Dashboard;


import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RestClient;

import org.elasticsearch.client.RequestOptions;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;

@RestController
public class Requests {


    @GetMapping("/groupCommunities")
    public Set<String> getGroupCommunities() throws IOException {
        RestHighLevelClient client = initClient();

        SearchResponse searchResponse = searchResponse(client);
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        Set<String> communities = new TreeSet<String>();
        for (SearchHit hit : searchHits) {
//            System.out.println(hit.getSourceAsMap());
            String community = "";
            try {
                community = (hit.getSourceAsMap()).get("group-communities").toString();

            }catch (Exception e){
                //todo
            }
            community = community.replace("[","").replace("]","");
            String[] communityArr = community.split(",");
            for (String s : communityArr) {
                if(!s.trim().equals("")) {
                    communities.add(s.trim());
                }
            }
        }
        client.close();
        return communities;
    }

    @GetMapping("/services")
    @ResponseBody
    public Map<String, List<Map>> getServices(@RequestParam String serviceName) throws IOException {
        RestHighLevelClient client = initClient();
        SearchResponse searchResponse = searchTermResponse(client, serviceName);
        String scrollId = searchResponse.getScrollId();
        SearchHits hits = searchResponse.getHits();


        Map<String, List<Map>> serviceMap = new TreeMap<>();

        for (SearchHit hit : hits) {
            String service = "";
            try {
                service = (hit.getSourceAsMap()).get("service-name").toString();
                service = service.replace("[","").replace("]","");
                if(serviceMap.containsKey(service)) {
                    serviceMap.get(service).add(hit.getSourceAsMap());
                }else {
                    List<Map> serviceList = new ArrayList<>();
                    serviceList.add(hit.getSourceAsMap());

                    serviceMap.put(service, serviceList);
                }
            }catch (Exception e){
                //todo
//                e.printStackTrace();
            }
        }
        client.close();
//        System.out.println(serviceMap.keySet());
        return serviceMap;
    }



    private SearchResponse searchResponse(RestHighLevelClient client) throws IOException {
        SearchRequest searchRequest = new SearchRequest("lookup");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        searchSourceBuilder.from(0);
        searchSourceBuilder.size(10000);

        searchRequest.source(searchSourceBuilder);
        return client.search(searchRequest, RequestOptions.DEFAULT);
    }

    private SearchResponse searchTermResponse(RestHighLevelClient client, String term) throws IOException {
        SearchRequest searchRequest = new SearchRequest("lookup");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.size(10000);
        searchSourceBuilder.query(matchQuery("group-communities", term));
        searchRequest.source(searchSourceBuilder);
        return client.search(searchRequest, RequestOptions.DEFAULT);
    }

    private RestHighLevelClient initClient() {
        return new RestHighLevelClient(
                        RestClient.builder(
                                new HttpHost("localhost", 9200, "http"), new HttpHost("localhost", 9201, "http")));
    }
}
