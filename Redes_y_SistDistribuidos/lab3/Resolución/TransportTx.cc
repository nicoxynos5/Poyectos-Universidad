#ifndef TRANSPORT_TX
#define TRANSPORT_TX

#include <string.h>
#include <omnetpp.h>
#include "FeedbackPkt_m.h"

using namespace omnetpp;

class TransportTx: public cSimpleModule {
private:
    // Data
    cQueue buffer;
    cMessage *endServiceEvent;
    cMessage *feedBack;
    simtime_t serviceTime;
    cOutVector bufferSizeVector;
    cOutVector packetDropVector;
    int capacidad;
public:
    TransportTx();
    virtual ~TransportTx();
protected:
    virtual void initialize();
    virtual void finish();
    virtual void handleMessage(cMessage *msg);
};

Define_Module(TransportTx);

TransportTx::TransportTx() {
    endServiceEvent = NULL;
    feedBack = NULL;
}

TransportTx::~TransportTx() {
    cancelAndDelete(endServiceEvent);
}

void TransportTx::initialize() {
    buffer.setName("buffer");
    bufferSizeVector.setName("bufferSize");
    packetDropVector.setName("PERDIDOS");
    endServiceEvent = new cMessage("endService");
    feedBack = new cMessage("feedBack");
    capacidad = 20000000;
}

void TransportTx::finish() {
}

void TransportTx::handleMessage(cMessage *msg) {
    //si es de tipo 2 (feedBack)
    if (msg->getKind()==2) {
        FeedbackPkt *feedBack = (FeedbackPkt*)msg;
        capacidad = feedBack->getCurrentBufferSize();
        delete(msg);
        //si es de tipo 0
    }else if(msg->getKind()==0){
        // if msg is signaling an endServiceEvent
        if (msg == endServiceEvent) {
            // if packet in buffer, send next one
            if (!buffer.isEmpty()) {
                // dequeue packet
                // SOLO enviamos si el buffer receptor tiene lugar para almacenar 2 más
                if(capacidad > 2){

                    cPacket *pkt = (cPacket*) buffer.pop();
                    send(pkt, "toOut$o");
                    // start new service
                    serviceTime = pkt->getDuration();
                    scheduleAt(simTime() + serviceTime, endServiceEvent);
                }
            }
        }else { // if msg is a data packet
                if (buffer.getLength() >= par("bufferSize").intValue()){
                    //drop the packet
                    delete msg;
                    this->bubble("packet dropped");
                    packetDropVector.record(1);
                } else {
                    // enqueue the packet
                    buffer.insert(msg);
                    bufferSizeVector.record(buffer.getLength());
                    // if the server is idle
                    if (!endServiceEvent->isScheduled()) {
                        // start the service
                        scheduleAt(simTime() + 0, endServiceEvent);
                    }
                }
        }
    }
}

#endif /* TRANSPORT_TX */
