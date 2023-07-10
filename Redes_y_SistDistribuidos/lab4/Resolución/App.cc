#ifndef APP
#define APP

#include <string.h>
#include <omnetpp.h>
#include <packet_m.h>

using namespace omnetpp;

class App: public cSimpleModule {
private:
    cMessage *sendMsgEvent;
    cStdDev delayStats;
    cOutVector delayVector;
    cOutVector hopCount;
    cOutVector packetUsedVector;
    cOutVector packetGenVector;
    int array[250];
public:
    App();
    virtual ~App();
protected:
    virtual void initialize();
    virtual void finish();
    virtual void handleMessage(cMessage *msg);
};

Define_Module(App);

#endif /* APP */

App::App() {
}

App::~App() {
}

void App::initialize() {

    // If interArrivalTime for this node is higher than 0
    // initialize packet generator by scheduling sendMsgEvent
    if (par("interArrivalTime").doubleValue() != 0) {
        sendMsgEvent = new cMessage("sendEvent");
        scheduleAt(par("interArrivalTime"), sendMsgEvent);
    }

    // Initialize statistics
    delayStats.setName("TotalDelay");
    delayVector.setName("Delay");
    hopCount.setName("totalHop");
    packetUsedVector.setName("RECIBIDOS");
    packetGenVector.setName("ENVIADOS");

    memset(array, 0, sizeof(array));
}

void App::finish() {
    // Record statistics
    recordScalar("Average delay", delayStats.getMean());
    recordScalar("Number of packets", delayStats.getCount());
}

void App::handleMessage(cMessage *msg) {

    // if msg is a sendMsgEvent, create and send new packet
    if (msg == sendMsgEvent) {
        // create new packet
        Packet *pkt = new Packet("packet",this->getParentModule()->getIndex());
        pkt->setByteLength(par("packetByteSize"));
        pkt->setSource(this->getParentModule()->getIndex());
        pkt->setDestination(par("destination"));
        pkt->setHopCount(0);

        // send to net layer
        packetGenVector.record(1);
        send(pkt, "toNet$o");

        // compute the new departure time and schedule next sendMsgEvent
        simtime_t departureTime = simTime() + par("interArrivalTime");
        scheduleAt(departureTime, sendMsgEvent);

    }
    // else, msg is a packet from net layer
    else {
        // compute delay and record statistics
        simtime_t delay = simTime() - msg->getCreationTime();
        delayStats.collect(delay);
        delayVector.record(delay);

        Packet *pkt = (Packet *) msg;
        hopCount.record(pkt->getHopCount());
        packetUsedVector.record(1);
        // delete msg
        array[pkt->getSource()]++;
        EV << "PAQUETES RECIBIDOS DEL:" << endl;
        for (int i = 0; i < 250; i++) {
            if(array[i]!=0){
                EV << "Nodo " << i << ": " << array[i] << endl;
            }
        }
        delete (msg);
    }

}
