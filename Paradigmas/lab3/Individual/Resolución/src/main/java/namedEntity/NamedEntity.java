package namedEntity;


/*Esta clase modela la nocion de entidad nombrada*/

import java.io.Serializable;

public class NamedEntity implements Serializable {
	String name;
	String category;
	String topic;
	int frequency;
	
	public NamedEntity(String name, String category, String topic, int frequency) {
		super();
		this.name = name;
		this.category = category;
		this.topic = topic;
		this.frequency = frequency;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public int getFrequency() {
		return frequency;
	}

	public void setFrequency(int frequency) {
		this.frequency = frequency;
	}

	public void incFrequency() {
		this.frequency++;
	}

	@Override
	public String toString() {
		return "ObjectNamedEntity [name=" + name + ", frequency=" + frequency + "]";
	}
	public void prettyPrint(){
		System.out.println(toString());
	}
	
	
}



