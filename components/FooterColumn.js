function FooterColumn({ index, data }) {
    const columnItems = data.map((item, idx) =>
      idx === 0 
        ? <h5 key={idx} className="font-bold">{item}</h5> 
        : <p key={idx}>{item}</p>
    );
  
    return (
      <div className="space-y-4 text-xs text-gray-800">
        {columnItems}
      </div>
    );
  }
  
  export default FooterColumn;
  