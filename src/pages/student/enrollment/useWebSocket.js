// useWebSocket.js
import {useEffect, useState} from 'react';
import {Client} from '@stomp/stompjs';

const useWebSocket = (studentId, courses) => {
    const [stompClient, setStompClient] = useState(null);
    const [currentEnrollments, setCurrentEnrollments] = useState({});

    // 웹소켓 연결 설정 - courses와 독립적으로
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new WebSocket('ws://localhost:8081/ws-enrollment'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                //console.log('STOMP Debug', str);
            },
            onConnect: () => {
                console.log("WebSocket Connected Successfully!");
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('STOMP Error: ', frame);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket Error: ', event);
            }
        });

        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, []);  // 빈 의존성 배열

    // 구독 로직을 별도의 useEffect로 분리
    useEffect(() => {
        if (!stompClient || !stompClient.connected) return;

        // 수강신청 결과 구독
        const enrollmentResultSubscription = stompClient.subscribe(
            `/user/${studentId}/topic/enrollment-result`,
            message => {
                const result = JSON.parse(message.body);
                console.log("수강신청 결과: ", result);
                alert(result.message);
            }
        );

        // 강의별 상태 업데이트 구독
        const subscriptions = [];
        const coursesArray = Object.values(courses);

        if (coursesArray.length > 0) {
            coursesArray.forEach(course => {
                const courseStatusSubscription = stompClient.subscribe(
                    `/topic/course-status/${course.openingId}`,
                    message => {
                        const update = JSON.parse(message.body);
                        setCurrentEnrollments(prev => ({
                            ...prev,
                            [update.openingId]: update.currentEnrollment
                        }));
                    }
                );
                subscriptions.push(courseStatusSubscription);
            });
        }

        return () => {
            enrollmentResultSubscription.unsubscribe();
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, [stompClient, studentId, courses]);

    return currentEnrollments;
};

export default useWebSocket;